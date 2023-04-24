// main.go
package main

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"log"
	"os"
	"time"
)

func main() {
	_ = godotenv.Load("../.env")
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/api/get_jwt", func(c echo.Context) error {
			// or to get the authenticated record:
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			id := authRecord.GetId()
			username := authRecord.Username()
			email := authRecord.Email()
			
			is_admin := 0
			err := app.Dao().DB().Select("count(*)").From("_admins").Where(dbx.HashExp{"email": email}).Row(&is_admin)

			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"id":         id,
				"username":   username,
				"expiration": time.Now().Add(7 * 24 * time.Hour).Unix(),
				"is_admin":   is_admin > 0,
			})

			privateKey := os.Getenv("ACCESS_PRIVATE_KEY")
			pkStream := []byte(privateKey)

			tokenString, err := token.SignedString(pkStream)

			if err != nil {
				return apis.NewBadRequestError("Something went wrong while signing JWT: "+err.Error(), nil)
			}

			return c.JSON(200,
				map[string]any{"token": tokenString},
			)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
