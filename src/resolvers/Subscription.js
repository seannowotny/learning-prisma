
const newLink = {
  subscribe: (parent, args, context, info) => context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node(),
  resolve: payload => payload
};

module.exports = {
  newLink
};
