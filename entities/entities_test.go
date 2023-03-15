package entities

import (
	"testing"
)

var userRepo CRUDRepository[*User] = NewMockRepo[*User]()

func TestSimpleCreate(t *testing.T) {
	id := userRepo.create(&User{
		id:       "null",
		name:     "Ashley",
		email:    "ash@gmail.com",
		grannyId: nil,
		verified: false,
	})
	got, ok := userRepo.get(id)
	if !ok {
		t.Errorf("Id not found after creation")
	}
	if got.name != "Ashley" {
		t.Errorf("Names do not match")
	}
}
