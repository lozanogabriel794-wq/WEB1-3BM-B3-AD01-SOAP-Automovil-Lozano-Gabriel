using AutoSoap.Data;
using AutoSoap.Services;
using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ConcesionariaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddScoped<IVehiculoService, VehiculoService>();
builder.Services.AddScoped<VehiculoService>();

builder.Services
    .AddServiceModelServices()
    .AddServiceModelMetadata();

builder.Services.AddSingleton<IServiceBehavior, UseRequestHeadersForMetadataAddressBehavior>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseStaticFiles();

app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<VehiculoService>(options =>
        {
            options.DebugBehavior.IncludeExceptionDetailInFaults = true;
        })
        .AddServiceEndpoint<VehiculoService, IVehiculoService>(
            new BasicHttpBinding(),
            "/Service.svc"
        );
});

var metadataBehavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
metadataBehavior.HttpGetEnabled = true;

app.Run();