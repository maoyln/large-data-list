import VList from "../../components/base04/Vlist";
import Item from "../../components/base04/Item";
import {faker} from "@faker-js/faker";

let data = [];
for (let id = 0; id < 100; id++) {
  const item: any = {
    id,
    value: faker.lorem.paragraphs() // 长文本
  };

  if (id % 10 === 1) {
    item.src = faker.image.image();
  }
  data.push(item);
}

export default function App() {
  return (
    <div className="App">
      <VList list={data}>
        {({ index, item, measure }) => (
          <Item
            index={index}
            key={item.id}
            item={item}
            measure={measure}
          >
            <>
              {item.value}
              {item.src && <img src={item.src} alt="" />}
            </>
          </Item>
        )}
      </VList>
    </div>
  );
}
