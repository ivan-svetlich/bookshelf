using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Bookshelf.Data;
using Bookshelf.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Bookshelf.Services;
using Bookshelf.Models;
using Bookshelf.Hubs;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MercadoPago.Config;

namespace Bookshelf
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig"));

            services.Configure<ReCaptchaConfig>(Configuration.GetSection("ReCaptchaConfig"));

            services.Configure<EmailSettings>(Configuration.GetSection("MailSettings"));

            services.AddTransient<IMailService, Services.EmailService>();

            services.Configure<LocalStorageConfig>(Configuration.GetSection("LocalStorage"));

            services.Configure<PaymentConfig>(Configuration.GetSection("PaymentConfig"));

            services.Configure<ClientSettings>(Configuration.GetSection("Client"));

            services.AddCors(options =>
        {
                options.AddPolicy(MyAllowSpecificOrigins,
                    builder => builder
                    .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001", "https://api.mercadopago.com", "http://192.168.0.93:3000")
                    .AllowAnyHeader().AllowAnyMethod().AllowCredentials());
                    //.WithHeaders("authorization", "accept", "content-type", "origin", "X-Auth-Token"));
            });

            services.AddHttpsRedirection(options =>
            {
                options.HttpsPort = 443;
            });

            services.AddControllers();

            services.AddDbContext<BookContext>(opt =>
                                               opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(jwt => {
                    var key = System.Text.Encoding.ASCII.GetBytes(Configuration["JwtConfig:Secret"]);

                    jwt.SaveToken = true;
                    jwt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        RequireExpirationTime = false
                    };
                    jwt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            if (!string.IsNullOrEmpty(accessToken))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };

                });

            services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true)
                        .AddRoles<IdentityRole>()
                        .AddEntityFrameworkStores<BookContext>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole",
                    policy => policy.RequireRole("Admin"));
            });

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TodoApi v1"));
            }

         
            app.UseRouting();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chatHub");
            });
        }
    }
}
