import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function CatalogSearch({ handleSearch }) {
  const [form, setForm] = useState({ search: '' });
  const {
    search,
    /*loading,
  error,*/
  } = useSelector((state) => state.catalog);
  // устанавливаем начальное значение строки поиска, которое получаем из "хедера"
  useEffect(() => {
    setForm((prevForm) => ({ ...prevForm, search }));
  }, [search]);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setForm((prevForm) => ({ ...prevForm, search: value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // if (!form.search) return;
    // отправка пустого поиска сбросит поисковый запрос
    // это удобно, иначе никак не сбросить запрос, кроме перезагрузки
    // дополнительно сделал сброс поиска при выборе категории "Все"
    handleSearch(form.search.trim());
    // setForm({ search: '' });
    // пусть будет без очистки формы, т.к. может быть юзер захочет скорректировать введенный запрос
  };
  console.log('SearchCatalog_form: ', form);
  return (
    <form className="catalog-search-form form-inline" onSubmit={handleSubmit}>
      <input
        className="form-control"
        placeholder="Поиск"
        value={form.search}
        onChange={handleChange}
      />
    </form>
  );
}
