using Dunyana.API.Filters;
using Dunyana.API.Middleware;
using Dunyana.DataAccess;
using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.NAQEL;
using Dunyana.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.Swagger;
using System.Text;

namespace Dunyana.API
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                // ReSharper disable ArgumentsStyleLiteral
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                // ReSharper restore ArgumentsStyleLiteral
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }


        public IConfigurationRoot Configuration { get; }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            const string corsPolicyName = "AllowAllOrigins";

           

            services.AddCors(options =>
            {
                options.AddPolicy(corsPolicyName,
                builder =>
                {
                    builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            #region Authorizarion
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = Configuration["AppSettings:Issuer"],
                    ValidAudience = Configuration["AppSettings:Audience"]

                };
            });
            #endregion

            #region Session 
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true; // consent required
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            services.AddSession(options => {
                options.IdleTimeout = System.TimeSpan.FromMinutes(60);//You can set Time  
                //options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();
            services.AddDistributedMemoryCache();
            #endregion

            ConfigureRepositoriesAndServices(services);
            //services.Configure<ApiBehaviorOptions>(options =>
            //{
            //    options.SuppressModelStateInvalidFilter = true;
            //});
            services.AddCheckoutSdk(Configuration);

            // services.AddMvc()
            // services.AddSession();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IMobileService,MobileService>();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Info { Title = "Dunyana API", Version = "V1" });
                options.AddSecurityDefinition("oauth2", new ApiKeyScheme
                {
                    Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
                    In = "header",
                    Name = "Authorization",
                    Type = "apiKey"
                });
                var filePath = System.IO.Path.Combine(System.AppContext.BaseDirectory, "Dunyana.API.xml");
                options.IncludeXmlComments(filePath);
                options.OperationFilter<SecurityRequirementsOperationFilter>();
            });
                //services.AddSwaggerGen(c =>
                //{
                //    c.SwaggerDoc("v1", new Info { Title = "Dunyana API", Version = "V1" });
                //}); 
                services
               .AddDbContext<DunyanaDbContext>(opts =>
               {
                   opts.UseMySQL(Configuration.GetConnectionString("DefaultConnection"));
               });
            ILoggerFactory loggerFactory = new LoggerFactory();
            services.Configure<MvcOptions>(opts =>
            {
                opts.Filters.Add(new CorsAuthorizationFilterFactory(corsPolicyName));

                opts.Filters.Add(new ModelStateFilter(loggerFactory.CreateLogger<ModelStateFilter>())); 
            });
            // Add framework services.
            services.AddMvc()
                .AddJsonOptions(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                 .AddSessionStateTempDataProvider();
            services.AddSession();
            // Register the Swagger services
            // services.AddSwaggerDocument();
            services.AddMvcCore();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
            //,        SymDbContext context)
        {
            app.UseCors(builder => builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials()
               );
            app.UseStaticFiles();
            loggerFactory.AddFile("Logs/SYM-{Date}.txt");
            app.UseMiddleware(typeof(LogAndErrorHandlingMiddleware));
            app.UseAuthentication();
            app.UseSession();
            app.UseMvc();
            //app.UseSwagger();
            //app.UseSwaggerUi3();
            //app.UseReDoc();        
            app.UseSwagger();
            app.UseSwaggerUI(c => {
               // c.SwaggerEndpoint("/dunyanaAPI/swagger/v1/swagger.json", "post API V1");
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "post API V1");
            });
            
        }



        private void ConfigureRepositoriesAndServices(IServiceCollection services)
        {
            // repositories here
            services.AddScoped<LookupTypeRepository, LookupTypeRepository>();
            services.AddTransient<LookupTypeService>();
            services.AddScoped<LookupTypeValueRepository, LookupTypeValueRepository>();
            services.AddTransient<LookupTypeValuesService>();
            services.AddScoped<CustomerRegistrationRepository, CustomerRegistrationRepository>();
            services.AddTransient<CustomerRegistrationService>();
            services.AddScoped<UsersRepository, UsersRepository>();
            services.AddTransient<UsersService>();
            services.AddScoped<CategoryRepository, CategoryRepository>();
            services.AddTransient<CategoryService>();
            services.AddScoped<BannerRepository, BannerRepository>();
            services.AddTransient<BannerService>();
            services.AddScoped<OTPAuthenticationRepository, OTPAuthenticationRepository>();
            services.AddTransient<OTPAuthenticationService>();
            services.AddScoped<DealsRepository, DealsRepository>();
            services.AddTransient<DealsService>();
            services.AddScoped<MerchantRepository, MerchantRepository>();
            services.AddTransient<MerchantService>();
            services.AddScoped<OrderRepository, OrderRepository>();
            services.AddTransient<OrdersService>();
            services.AddScoped<OrderAddressRepository, OrderAddressRepository>();
            services.AddTransient<OrdersAddressService>();
            services.AddScoped<OrderDetailsRepository, OrderDetailsRepository>();
            services.AddTransient<OrdersDetailsService>();
            services.AddScoped<MerchantCategoryRepository, MerchantCategoryRepository>();
            services.AddTransient<MerchantCategoryService>();
            services.AddScoped<UserAduitRepository, UserAduitRepository>();
            services.AddTransient<UserAduitServices>();
            services.AddTransient<NaqelDataAccess>();
            services.AddTransient<NaqelServices>();
            services.AddTransient<MerchantRedirectionService>();
            services.AddScoped<MerchantRedirectionRepository, MerchantRedirectionRepository>();
            services.AddTransient<MerchantContractService>();
            services.AddScoped<MerchantContractRepository, MerchantContractRepository>();
            services.AddTransient<MerchantRequestService>();
            services.AddScoped<MerchantRequestRepository, MerchantRequestRepository>();
            services.AddTransient<MerchantSellCountriesService>();
            services.AddScoped<MerchantSellCountriesRepository, MerchantSellCountriesRepository>();
            services.AddTransient<WalletHistoryService>();
            services.AddScoped<WalletHistoryRepository, WalletHistoryRepository>();
            services.AddTransient<NaqelUsersService>();
            services.AddScoped<NaqelUsersRepository, NaqelUsersRepository>();
            services.AddTransient<WalletService>();
            services.AddScoped<WalletRepository, WalletRepository>();
            services.AddScoped<DisableLazyLoadingFilter>();
            services.AddScoped<DataBaseService, DataBaseService>();
            services.AddTransient<PaymentService>();
            services.AddScoped<PaymentResponseRepository, PaymentResponseRepository>();
            services.AddTransient<PaymentResponseService>();
            services.AddScoped<PaymentCardsRepository, PaymentCardsRepository>();
            services.AddTransient<PaymentCardsService>();
            services.AddScoped<MerchantBannerRepository, MerchantBannerRepository>();
            services.AddTransient<MerchantBannerService>();
            services.AddScoped<MerchantDealRepository, MerchantDealRepository>();
            services.AddTransient<MerchantDealService>();
            services.AddScoped<AdminPromotionalRepository, AdminPromotionalRepository>();
            services.AddTransient<AdminPromotionalService>();
            services.AddScoped<AdminPromotionalCountriesRepository, AdminPromotionalCountriesRepository>();
            services.AddTransient<AdminPromotionalCountriesService>();
            services.AddScoped<MerchantCatalogRepository, MerchantCatalogRepository>();
            services.AddTransient<MerchantCatalogService>();
            services.AddScoped<MerchantContractDetailsRepository, MerchantContractDetailsRepository>();
            services.AddTransient<MerchantContractDetailServices>();
            services.AddScoped<MerchantRequestDetailsRepository, MerchantRequestDetailsRepository>();
            services.AddTransient<MerchantRequestDetailsService>();
            services.AddScoped<MerchantBonusRepository, MerchantBonusRepository>();
            services.AddTransient<MerchantBonusService>();
            services.AddTransient<WalletPointsService>();
            services.AddScoped<WalletPointsRepository, WalletPointsRepository>();
            services.AddTransient<WalletPointsHistoryService>();
            services.AddScoped<WalletPointsHistoryRepository, WalletPointsHistoryRepository>();
            services.AddTransient<WayBillService>();
            services.AddScoped<WayBillRepository, WayBillRepository>();
        }

    }
}
