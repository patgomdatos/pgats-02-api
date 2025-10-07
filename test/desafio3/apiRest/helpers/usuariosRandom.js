function gerarUsuario() {
  //Gera o numero random, multiplica e arredonda para que não seja valor quebrado
  const random = Math.floor(Math.random() * 1000000);
  return {
    username: `usuario${random}`,
    password: `senha${random}`,
    favorecidos: [`favorecido${random}`]
  };
};

module.exports = { gerarUsuario };