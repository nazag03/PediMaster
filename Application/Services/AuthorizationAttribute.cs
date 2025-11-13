using System.Diagnostics;

namespace WebApi.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class AuthorizationAttributeCustom : Attribute, IAuthorizeData
    {
        public AuthorizationAttributeCustom() { }
        public AuthorizationAttributeCustom(string policy)
        {
            Policy = policy;
        }

        public string? Policy { get; set; }  
        public List<string>? Roles { get; set; }
        public string? AuthenticationSchemes { get; set; }
    }

    public interface IAuthorizeData
    {
        string? Policy { get; }
        List<string>? Roles { get; set; }
        string? AuthenticationSchemes { get; set; }
    }
}
