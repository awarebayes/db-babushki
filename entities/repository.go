package entities

type CRUDRepository[T Storable] interface {
	create(T) string
	update(id string, elem T) bool
	remove(id string) bool
	get(id string) (T, bool)
	getPaged(page int, pageSize int) []T
}

type IUserRepository interface {
	CRUDRepository[*User]
	getByUserName(username string) User
}

type IGrandmaRepository interface {
	CRUDRepository[*Grandma]
}
