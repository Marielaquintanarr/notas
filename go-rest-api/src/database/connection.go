package database

import (
	"database/sql"
	"io/ioutil"
	"log"

	_ "github.com/lib/pq"
)

func GetConnection() *sql.DB {
	connStr := "postgresql://postgres_db_za89_user:DBkjYA4wKUrRsYhTNQ7VCVaD4KJPPmYF@dpg-d0qk2iumcj7s73e3tidg-a.render.com/postgres_db_za89"

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

	scriptPath := "database/script.sql"
	sqlBytes, err := ioutil.ReadFile(scriptPath)
	if err != nil {
		log.Fatal("No se pudo leer init.sql:", err)
	}

	_, err = db.Exec(string(sqlBytes))
	if err != nil {
		log.Fatal("Error ejecutando init.sql:", err)
	}

	log.Println("Script init.sql ejecutado correctamente")

	return db
}
