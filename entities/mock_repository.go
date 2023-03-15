package entities

import (
	"github.com/google/uuid"
)

type MockRepo[T Storable] struct {
	storage map[string]T
}

func (m *MockRepo[T]) create(elem T) string {
	var id = uuid.New().String()
	elem._setId(id)
	m.storage[id] = elem
	return id
}

func NewMockRepo[T Storable]() *MockRepo[T] {
	return &MockRepo[T]{
		storage: make(map[string]T),
	}
}

func (m *MockRepo[T]) update(id string, elem T) bool {
	_, ok := m.storage[id]
	if ok {
		m.storage[id] = elem
		return true
	}
	return false
}

func (m *MockRepo[T]) remove(id string) bool {
	if _, ok := m.storage[id]; ok {
		delete(m.storage, id)
		return true
	}
	return false
}

func (m *MockRepo[T]) get(id string) (T, bool) {
	elem, ok := m.storage[id]
	return elem, ok
}

func (m *MockRepo[T]) getPaged(page, pageSize int) []T {
	keys := make([]string, 0, len(m.storage))
	for k := range m.storage {
		keys = append(keys, k)
	}
	lower := page * pageSize
	upper := (page + 1) * pageSize
	if lower > len(m.storage) {
		return nil
	}
	if upper > len(m.storage) {
		upper = len(m.storage)
	}
	keysSlice := keys[lower:upper]
	result := make([]T, 0, pageSize)

	for _, k := range keysSlice {
		result = append(result, m.storage[k])
	}

	return result
}
