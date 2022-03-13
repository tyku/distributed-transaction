export default () => ({
  server: {
    port: process.env.NODE_ENV === 'docker' ? 9000 : process.env.PORT,
  },
});
