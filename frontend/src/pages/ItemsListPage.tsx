import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "Redux/hooks";
import Pagination from "../components/Pagination/Pagination";
import { fetchItems } from "Redux/slices/itemsListSlice";
import { Categories, CategoriesType } from "Types/form";
import s from "./ItemsListPage.module.css";
import { resetForm, setEditing } from "Redux/slices/formSlice";

type FilterOption = {
  title: string;
  variants: string[] | number[];
};

type FilterOptionsType = {
  [K in Exclude<
    CategoriesType[keyof CategoriesType],
    CategoriesType["DEFAULT"]
  >]: Record<string, FilterOption>;
};

const filterOptions: FilterOptionsType = {
  [Categories.REAL_ESTATE]: {
    propertyType: {
      title: "Тип недвижимости",
      variants: ["Квартира", "Дом", "Коттедж"],
    },
    rooms: { title: "Количество комнат", variants: [1, 2, 3, 4, 5] },
    price: {
      title: "Цена",
      variants: ["До 1 млн", "1-5 млн", "5-10 млн", "10+ млн"],
    },
  },
  [Categories.AUTO]: {
    brand: {
      title: "Марка",
      variants: ["Toyota", "BMW", "Mercedes"],
    },
    year: {
      title: "Год выпуска",
      variants: [2015, 2016, 2017, 2018, 2019, 2020],
    },
    mileage: {
      title: "Пробег",
      variants: ["0-50 тыс", "50-100 тыс", "100+ тыс"],
    },
  },
  [Categories.SERVICES]: {
    serviceType: {
      title: "Тип услуги",
      variants: ["Ремонт", "Уборка", "Доставка"],
    },
    experience: {
      title: "Опыт работы",
      variants: ["1-3 года", "3-5 лет", "5+ лет"],
    },
    cost: {
      title: "Стоимость",
      variants: ["До 1000 руб", "1000-5000 руб", "5000+ руб"],
    },
  },
};

const ItemsListPage: React.FC = () => {
  const { items, error, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.items
  );
  const dispatch = useAppDispatch();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const [filteredItems, setFilteredItems] = useState(items);
  const [category, setCategory] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let updatedItems = items;

    if (category) {
      updatedItems = updatedItems.filter((item) => item.category === category);
    }

    Object.entries(additionalFilters).forEach(([key, value]) => {
      if (value) {
        updatedItems = updatedItems.filter(
          (item) => item[key]?.toString() === value
        );
      }
    });

    setFilteredItems(updatedItems.slice(startIndex, endIndex));
  }, [items, category, additionalFilters, startIndex, endIndex]);

  function handleSearchByName(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value.toLowerCase().trim();
    let updatedItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );

    if (category) {
      updatedItems = updatedItems.filter((item) => item.category === category);
    }

    setFilteredItems(updatedItems.slice(startIndex, endIndex));
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    setAdditionalFilters({}); // Сброс фильтров при смене категории
  }

  useEffect(() => {
    dispatch(setEditing(false));
    dispatch(resetForm());
  }, []);

  return (
    <div className={s.container}>
      <h1 className={s.title}>Список объявлений</h1>
      {error && <p className={s.errorMessage}>{error}</p>}

      <div className={s.filterContainer}>
        <select
          id="category"
          name="category"
          onChange={handleCategoryChange}
          className={s.selectBox}
          required
        >
          <option value="">Все категории</option>
          <option value={Categories.REAL_ESTATE}>
            {Categories.REAL_ESTATE}
          </option>
          <option value={Categories.AUTO}>{Categories.AUTO}</option>
          <option value={Categories.SERVICES}>{Categories.SERVICES}</option>
        </select>
        {/* Type guard for category to ensure it's a valid key */}
        {category in filterOptions &&
          Object.entries(
            filterOptions[category as keyof typeof filterOptions] || {}
          ).map(([key, options]) => (
            <select
              key={key}
              name={key}
              className={s.selectBox}
              onChange={(e) =>
                setAdditionalFilters({
                  ...additionalFilters,
                  [key]: e.target.value,
                })
              }
            >
              <option value="">{options.title}</option>
              {options.variants.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        <input
          type="search"
          className={s.searchBox}
          placeholder="Search..."
          onChange={handleSearchByName}
        />
      </div>

      <Link to={`/form`} className={s.submitButtonLink}>
        <button type="button" className={s.submitButton}>
          Разместить объявление
        </button>
      </Link>

      {filteredItems.length > 0 ? (
        <section className={s.itemsSection}>
          <ul className={s.itemsList}>
            {filteredItems.map((item) => (
              <li key={item.id} className={s.itemCard}>
                <article className={s.itemContainer}>
                  <div className={s.imageContainer}>
                    <img
                      className={s.image}
                      src={
                        item.photo && Object.keys(item.photo).length
                          ? item.photo
                          : "/assets/images/placeholder.png"
                      }
                      alt={item.name}
                    />
                  </div>
                  <div className={s.itemDetails}>
                    <h2 className={s.itemTitle}>{item.name}</h2>
                    <p className={s.itemLocation}>
                      <strong>Локация:</strong> {item.location}
                    </p>
                    <p className={s.itemCategory}>
                      <strong>Категория:</strong> {item.category}
                    </p>
                  </div>
                  <Link to={`/items/${item.id}`} className={s.itemLink}>
                    Открыть
                  </Link>
                </article>
              </li>
            ))}
          </ul>
          <div className={s.paginationContainer}>
            <Pagination />
          </div>
        </section>
      ) : (
        !error && <p className={s.noItemsMessage}>No items found.</p>
      )}
    </div>
  );
};

export default ItemsListPage;
