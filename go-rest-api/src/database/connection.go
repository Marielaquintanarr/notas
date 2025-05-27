package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func GetConnection() *sql.DB {
	connStr := "postgresql://postgres_db_za89_user:DBkjYA4wKUrRsYhTNQ7VCVaD4KJPPmYF@dpg-d0qk2iumcj7s73e3tidg-a/postgres_db_za89"
	// connStr := "postgres://postgres:mariela2004@localhost:5432/postgres?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error abriendo conexión:", err)
	}

	// Verificar si realmente conecta
	err = db.Ping()
	if err != nil {
		log.Fatal("No se pudo conectar a la base de datos:", err)
	}

	log.Println("Conexión a la base de datos exitosa")
	return db
}
