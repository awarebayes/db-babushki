package entities

import "time"

type Storable interface {
	getId() string
	_setId(string)
}

type User struct {
	id       string
	name     string
	email    string
	grannyId *string
	verified bool
}

func (u *User) getId() string {
	return u.id
}

func (u *User) _setId(id string) {
	u.id = id
}

type Grandma struct {
	id                string
	userId            *string
	activelySearching bool
}

func (g *Grandma) getId() string {
	return g.id
}

func (g *Grandma) _setId(id string) {
	g.id = id
}

type MealCategory struct {
	id   string
	name string
}

func (mc *MealCategory) getId() string {
	return mc.id
}

func (mc *MealCategory) _setId(id string) {
	mc.id = id
}

type Meal struct {
	id         string
	grannyId   *string
	name       string
	price      float32
	categoryId string
}

func (m *Meal) getId() string {
	return m.id
}

func (m *Meal) _setId(id string) {
	m.id = id
}

type OrderStatus struct {
	id   string
	name string
}

func (os *OrderStatus) getId() string {
	return os.id
}

func (os *OrderStatus) _setId(id string) {
	os.id = id
}

type OrderItem struct {
	id      string
	itemId  *string
	orderId *string
	count   int
}

func (oi *OrderItem) getId() string {
	return oi.id
}

func (oi *OrderItem) _setId(id string) {
	oi.id = id
}

type OutsourceCourier struct {
	id string
}

func (oc *OutsourceCourier) getId() string {
	return oc.id
}

func (oc *OutsourceCourier) _setId(id string) {
	oc.id = id
}

type Order struct {
	id         string
	customerId *string
	orderDate  time.Time
	courierId  *string
}

func (o *Order) getId() string {
	return o.id
}

func (o *Order) _setId(id string) {
	o.id = id
}
