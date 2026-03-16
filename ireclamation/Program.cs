using System.Text;
using AutoMapper;
using iReclamation;
using iReclamation.BuisnessLayers;
using iReclamation.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using OfficeOpenXml;
using Wkhtmltopdf.NetCore;

var  builder = WebApplication.CreateBuilder(args);

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

// Add services to the container.

var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new MappingProfile());
});
IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddScoped<UserService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("JwtSettings:Key").Value)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration.GetSection("JwtSettings:Issuer").Value,
            ValidAudience = builder.Configuration.GetSection("JwtSettings:Audience").Value,
            ClockSkew = TimeSpan.Zero,
        };

        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.Events = new JwtBearerEvents()
        {
            OnAuthenticationFailed = c =>
            {
                if (c.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    c.Response.Headers.Add("Token-Expired", "true");
                    c.Response.StatusCode = 401;
                }

                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";
                    context.HandleResponse();

                    var result = JsonConvert.SerializeObject("You are not Authorized");
                    return context.Response.WriteAsync(result);
                }
                else
                {
                    var result = JsonConvert.SerializeObject("Token Expired");
                    return context.Response.WriteAsync(result);
                };
            },
            OnForbidden = context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";

                var result = JsonConvert.SerializeObject("You are not authorized to access this resource");
                return context.Response.WriteAsync(result);
            },
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // If the request is for our hub...
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/chathub")))
                {
                    // Read the token out of the query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };

    }
);

// builder.Services.AddWkhtmltopdf();


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "backEnd",
    policy =>
    {
        policy.WithOrigins(
            "http://localhost:80", // Angular app
            "http://localhost:4200",
            "ireclamationfront", // Local development
            "http://192.168.1.31",
            "http://192.168.1.31:4200"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
}   
);


builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
//Add HtmlToPdf
var rotativaPath = Path.Combine(builder.Environment.ContentRootPath, "Rotativa");
if (!Directory.Exists(rotativaPath))
{
    throw new DirectoryNotFoundException($"Rotativa folder not found at: {rotativaPath}");
}
builder.Services.AddWkhtmltopdf(rotativaPath);// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ConnectionString"),
        sqlServerOptions => sqlServerOptions.CommandTimeout(180) // Set timeout to 180 seconds
    )
);
builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();
app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
}




app.UseCors("backEnd");

app.UseHttpsRedirection();
app.UseAuthentication();


app.UseAuthorization();

app.MapControllers();

app.Run();