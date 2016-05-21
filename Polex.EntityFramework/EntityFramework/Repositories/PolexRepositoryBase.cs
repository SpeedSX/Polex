using Abp.Domain.Entities;
using Abp.EntityFramework;
using Abp.EntityFramework.Repositories;

namespace Polex.EntityFramework.Repositories
{
    public abstract class PolexRepositoryBase<TEntity, TPrimaryKey> : EfRepositoryBase<PolexDbContext, TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected PolexRepositoryBase(IDbContextProvider<PolexDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //add common methods for all repositories
    }

    public abstract class PolexRepositoryBase<TEntity> : PolexRepositoryBase<TEntity, int>
        where TEntity : class, IEntity<int>
    {
        protected PolexRepositoryBase(IDbContextProvider<PolexDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //do not add any method here, add to the class above (since this inherits it)
    }
}
