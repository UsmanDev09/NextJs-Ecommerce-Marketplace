import { useRouter } from "next/router";
import Link from "next/link";

import  Category  from "../../../model/category";
import Products from "../../../components/Products/Products";
import SideBar from "../../../components/Categories/SideBar";
import Rating from "../../../components/Products/Rating";
import CategoryAPI from "../../../api/category/category";
import PriceRange from "../../../components/PriceRange/PriceRange";
import * as path from "../../../constants/paths";

const SingleCategory = ({categories, category, addToCart}) => {
  console.log('categories2', categories, category);
  const router = useRouter();
  const sideBarCategories = router.query.categories;
  return (
    <>
      <div className="flex">
        <div className=" w-80  ml-24 mt-4">
          <SideBar />
          {categories &&
            categories.map((category) => {
              return (
                <>
                {`${path.CATEGORIES}/${router.query.categoryName}` !== `${path.CATEGORIES}/${category[Object.keys(category)[0]].name}` ?
                   <Link
                    href={{
                      pathname: `/${path.CATEGORIES}/${category[Object.keys(category)[0]].name}`,
                      query: { categories: sideBarCategories },
                    }}
                  >
                    <h1 className="text-[#1C1F22] font-comfortaa text-s px-3 mt-2 mb-2">
                      {category[Object.keys(category)[0]].name}
                    </h1>
                  </Link>
                :
                <h1 className="text-[#A042E1] font-comfortaa cursor-pointer text-s px-3 mt-2 mb-2">
                  {category[Object.keys(category)[0]].name}
                </h1>
                }

                </>
              );
            })}

          <h1 className="font-unica text-2xl px-3 mt-8 mb-4">RATING</h1>
          <div className="flex items-center px-3 mb-2">
            <Rating stars={5}/>
          </div>
          <div className="flex items-center px-3 mb-2">
            <Rating stars={4}/>
          </div>
          <div className="flex items-center px-3 mb-2">
            <Rating stars={3}/>
          </div>
          <div className="flex items-center px-3 mb-2">
            <Rating stars={2}/>
          </div>
          <div className="flex items-center px-3 mb-2">
            <Rating stars={1} />
          </div>

          <h1 className="font-unica text-2xl mt-8 mb-0 px-3">PRICE RANGE</h1>
          <PriceRange />

          <p className="text-center mt-6 font-comfortaa text-[#1C1F22]">$0 - $999+</p>
        </div>
        <div className="w-3/4">
          <div>
            {console.log('categories', category[0])}
            <Products
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              removeProductFromCart={removeProductFromCart}
              clearCart={clearCart}
              subTotal={subTotal}
              hideCategoryName={true}
              categoryName={category.name}
              products={category[0].products !== null && category[0].products}
              height={220}
              width={271}
              gap={24}

            />
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async (context) => {
  const name = context.params.categoryName;
  console.log('name, name', name)
  try {
    const response = await CategoryAPI.getCategory(name);
            console.log('ress', response)

    const singleCategory = await response.json();
        console.log('ress', singleCategory)

    return {
      props: {
        category: singleCategory,
      },
    };
  } catch (error) {
    return {
      props: { errCode: 500, message: error },
    };
  }
};

export const getStaticPaths = async () => {
  try {
    // const response = await CategoryAPI.getAllCategories();
    // const categories = await response.json();
    // const arrayOfCategories = Object.entries(categories).map((e) => ( { [e[0]]: e[1] } ))
    // const names = arrayOfCategories.map((category) => category[Object.keys(category)[0]].name);
    // const paths =  names.map((name) => ({
    //   params: {
    //     categoryName: name.toString(),
    //   },
    // }))
    const paths = []

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    return {
      props: { errCode: 500, message: error },
    };
  }
};

export default SingleCategory;
