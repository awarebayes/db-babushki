// main.go
package main

import (
	"github.com/pocketbase/pocketbase"
	"log"
)

func main() {
	app := pocketbase.New()
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
