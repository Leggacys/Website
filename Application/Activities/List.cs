using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDTO>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper mapper;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                _context = context;
                _logger = logger;
                this.mapper = mapper;
            }



            public async Task<Result<List<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                .ProjectTo<ActivityDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

                return Result<List<ActivityDTO>>.Success(activities);
            }
        }
    }
}