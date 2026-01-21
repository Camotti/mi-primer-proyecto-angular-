var builder = WebApplication.CreateBuilder(args);

// 1. AGREGAR SERVICIOS PARA CONTROLADORES
builder.Services.AddControllers(); 

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. CONFIGURAR CORS (EL PERMISO PARA ANGULAR)
builder.Services.AddCors(options => {
    options.AddPolicy("PermitirAngular", policy => {
        policy.WithOrigins("http://localhost:4200") // La URL de tu Angular
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 3. CONFIGURAR EL PIPELINE (SWAGGER COMO PÁGINA DE INICIO)
app.UseSwagger();
app.UseSwaggerUI(c => 
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Usuarios V1");
    c.RoutePrefix = string.Empty; // Hace que Swagger sea la raíz (localhost:5250)
});

// IMPORTANTE: El orden de los "Use" importa
app.UseHttpsRedirection();

// 4. ACTIVAR CORS
app.UseCors("PermitirAngular");

app.UseAuthorization();

// 5. MAPEAR CONTROLADORES
app.MapControllers();

app.Run();