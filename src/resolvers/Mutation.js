const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../config');
const { getUserId } = require('../utils');

async function signup(parent, args, context, info)
{
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info)
{
  const user = await context.prisma.user({ email: args.email });

  if(user)
  {
    const valid = await bcrypt.compare(args.password, user.password);

    if(valid)
    {
      const token = jwt.sign({ userId: user.id }, APP_SECRET);

      return {
        token,
        user
      }
    }
    else
    {
      throw new Error('Invalid password');
    }
  }
  else
  {
    throw new Error('Wrong email');
  }
  
}

function post(parent, args, context, info)
{
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

module.exports = {
  signup,
  login,
  post
};
