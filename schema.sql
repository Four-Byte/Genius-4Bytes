DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
    id serial PRIMARY KEY ,
    title VARCHAR(256),
    authors VARCHAR(256),
    isbn VARCHAR(256),
    url VARCHAR(256),
    description text

);

INSERT INTO movies (title,authors,isbn,url,description) VALUES('foo','ghaid','321541','ghaid.zahran@hotmail.com','foolish book')