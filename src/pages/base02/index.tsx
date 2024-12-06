import VList from "../../components/base02/Vlist";
import Item from "../../components/base02/Item";
import {faker} from "@faker-js/faker";

let data: any[] = [];
for (let id = 0; id < 1000; id++) {
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
  // 开启图片
  const enableImag = true;

  return (
    <div className="App">
      <VList list={data}>
        {({index, item, measure}) => (
          <Item index={index} key={item.id} item={item} measure={measure}>
            <>
              {item.value}
              {enableImag && item.src && (
                <img src={item.src} onLoad={() => measure(index)} alt="" />
              )}
            </>
          </Item>
        )}
      </VList>
    </div>
  );
}
