using RazorLight;

namespace iReclamation.BuisnessLayers;

public class RazorViewRenderer
{
    private readonly RazorLightEngine _razorEngine;

    public RazorViewRenderer()
    {
        _razorEngine = new RazorLightEngineBuilder()
            .UseMemoryCachingProvider()
            .Build();
    }

    public async Task<string> RenderViewToStringAsync<TModel>(string viewName, TModel model)
    {
        return await _razorEngine.CompileRenderAsync(viewName, model);
    }
}
