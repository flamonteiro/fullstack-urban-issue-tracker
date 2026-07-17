CREATE TABLE perfil (
    idPerfil SERIAL PRIMARY KEY,
    tipo VARCHAR(50)
);

CREATE TABLE situacao (
    idSituacao SERIAL PRIMARY KEY,
    status VARCHAR(50)
);

CREATE TABLE endereco (
    idEndereco SERIAL PRIMARY KEY,
    rua VARCHAR(150),
    bairro VARCHAR(100),
    referencia VARCHAR(100),
    numero INT,
    cep TEXT
);

CREATE TABLE categoria (
    idCategoria SERIAL PRIMARY KEY,
    nomeCategoria VARCHAR(100)
);

CREATE TABLE usuario (
    idUsuario SERIAL PRIMARY KEY,
    email VARCHAR(100),
    senha VARCHAR(255),
    idPerfil INT,
    CONSTRAINT fk_usuario_perfil FOREIGN KEY (idPerfil) REFERENCES perfil(idPerfil)
);

CREATE TABLE ocorrencia (
    idOcorrencia SERIAL PRIMARY KEY,
    titulo VARCHAR(150),
    descricao TEXT,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idSituacao INT,
    idCategoria INT,
    idEndereco INT,
    idUsuario INT,
    CONSTRAINT fk_ocorrencia_situacao FOREIGN KEY (idSituacao) REFERENCES situacao(idSituacao),
    CONSTRAINT fk_ocorrencia_categoria FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria),
    CONSTRAINT fk_ocorrencia_endereco FOREIGN KEY (idEndereco) REFERENCES endereco(idEndereco),
    CONSTRAINT fk_ocorrencia_usuario FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);