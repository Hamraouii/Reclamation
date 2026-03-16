using iReclamation.Dtos;
using iReclamation.Models;
using File = iReclamation.Models.File;

namespace iReclamation;
using AutoMapper;


public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Sources, SourceDto>();
        var sourceMap = CreateMap<SourceDto, Sources>();
        sourceMap.ForMember(c => c.Id, opt => opt.Ignore());

        
        CreateMap<Services, ServiceDto>();
        var serviceMap = CreateMap<ServiceDto, Services>();
        serviceMap.ForMember(c => c.Id, opt => opt.Ignore());

        
        CreateMap<Adherent, AdherentDto>();
        var adherentMap = CreateMap<AdherentDto, Adherent>();
        adherentMap.ForMember(c => c.id, opt => opt.Ignore());

        
        CreateMap<Dossier, DossierDto>();
        var dossierMap =  CreateMap<DossierDto, Dossier>();
        dossierMap.ForMember(c => c.id, opt => opt.Ignore());

        
        CreateMap<EtatDossier, EtatDossierDto>();
        var etatDossier = CreateMap<EtatDossierDto, EtatDossier>();
        etatDossier.ForMember(c => c.Id, opt => opt.Ignore());

        
        CreateMap<EtatReclamation, EtatReclamationDto>();
        var EtatReclamationMap = CreateMap<EtatReclamationDto, EtatReclamation>();
        EtatReclamationMap.ForMember(c => c.Id, opt => opt.Ignore());

                
        CreateMap<UserDashboard, UserDashboardDto>();
        var UserDashboardMap = CreateMap<UserDashboardDto, UserDashboard>();
        UserDashboardMap.ForMember(c => c.Id, opt => opt.Ignore());

        
        CreateMap<Reclamations, ReclamationDto>();
        var reclamationMap = CreateMap<ReclamationDto, Reclamations>();
        reclamationMap.ForMember(c => c.Id, opt => opt.Ignore());

        CreateMap<Actions, ActionDto>();
        var actionMap = CreateMap<ActionDto, Actions>();
        actionMap.ForMember(c => c.Id, opt => opt.Ignore());

        
        CreateMap<HistoriqueReclamation, HistoriqueReclamationDto>();
        var HistoriqueReclamationMap = CreateMap<HistoriqueReclamationDto, HistoriqueReclamation>();
        HistoriqueReclamationMap.ForMember(c => c.Id, opt => opt.Ignore());

        CreateMap<Users, UsersDto>();
        var userMap = CreateMap<UsersDto, Users>();
        userMap.ForMember(c => c.UserId, opt => opt.Ignore());

        CreateMap<Regions, RegionDto>();
        CreateMap<RegionDto, Regions>();
        
        CreateMap<Reponse, ReponseDto>();
        CreateMap<ReponseDto, Reponse>();
        
        CreateMap<TypeReclamations, TypeReclamationDto>();
        CreateMap<TypeReclamationDto, TypeReclamations>();
        
        CreateMap<Users, UserDto>();
        CreateMap<UserDto, Users>();
        
        CreateMap<Villes, VilleDto>();
        CreateMap<VilleDto, Villes>();   
        
        CreateMap<File, FileDto>();
        CreateMap<FileDto, File>();   
        
    }
    
}