using Abp.Web.Mvc.Views;

namespace Polex.Web.Views
{
    public abstract class PolexWebViewPageBase : PolexWebViewPageBase<dynamic>
    {

    }

    public abstract class PolexWebViewPageBase<TModel> : AbpWebViewPage<TModel>
    {
        protected PolexWebViewPageBase()
        {
            LocalizationSourceName = PolexConsts.LocalizationSourceName;
        }
    }
}