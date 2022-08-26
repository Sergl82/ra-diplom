import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CatalogMenu from './CatalogMenu';
import CatalogSearch from './CatalogSearch';
import SectionCard from '../SectionCard';
import ButtonOffset from './ButtonOffset';
import Loader from '../Loader';
import Error from '../Error';
import {
  catalogCategoryChange,
  catalogSearchChange,
  catalogOffsetChange,
} from '../../../store/SliceCatalog';
import {
  fetchGetCatalogCategories,
  fetchGetCatalogContent,
} from '../../../api/index';

export default function Catalog({ nosearch }) {
  const {
    content,
    categories,
    activeCategoryId,
    search,
    offset,
    loading,
    error,
  } = useSelector((state) => state.catalog);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetCatalogCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchGetCatalogContent(activeCategoryId, search, offset));
  }, [dispatch, activeCategoryId, search, offset]);

  /*
  console.log('catalogContent_reducer_state: ', {
    content,
    categories,
    activeCategoryId,
    search,
    offset,
    // loading,
    // error,
  });
  */

  const menuItems = [
    {
      id: 0,
      title: 'Все',
    },
    ...categories,
  ];

  const handleSelect = (categoryId) => {
    // console.log('onSelect: ', categoryId);
    if (categoryId === activeCategoryId) return;
    if (categoryId === menuItems[0].id)
      return dispatch(catalogCategoryChange(0));
    dispatch(catalogCategoryChange(categoryId));
  };

  const handleOffset = () => {
    // console.log('Offset button click');
    dispatch(catalogOffsetChange());
  };

  const handleSearch = (searchString) => {
    // console.log('CatalogContent_searchString: ', searchString);
    dispatch(catalogSearchChange(searchString));
  };

  // console.log('CatalogContent_menuitem_active: ', category);
  const catalogCards = content.map((cardProps) => (
    <SectionCard key={cardProps.id} {...cardProps} />
  ));

  const badSearchPropValue = 'Ничего не найдено. Попробуйте еще раз.';

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      {(loading && <Loader />) || (error && <Error errorText={error} />) || (
        <>
          {nosearch ? null : <CatalogSearch handleSearch={handleSearch} />}
          <CatalogMenu
            menuItems={menuItems}
            categoryId={activeCategoryId}
            handleSelect={handleSelect}
          />
          <div className="row">
            {catalogCards.length
              ? catalogCards
              : search && <Error errorText={badSearchPropValue} />}
          </div>
          {catalogCards.length >= 6 ? (
            <ButtonOffset handleOffset={handleOffset} />
          ) : null}
        </>
      )}
    </section>
  );
}
