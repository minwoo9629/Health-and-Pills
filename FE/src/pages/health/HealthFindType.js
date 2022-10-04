import { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { client } from "../../api";
// import { useInView } from "react-intersection-observer";
import React from "react";
import HealthListCard from "../../components/cards/HealthListCard";

const CardWrapper = styled.div`
  background-color: #f5f5f5;
  margin-left: auto;
`;

const HealthButton = styled.button`
  display: inline-box;
  justify-content: center;
  margin: 5px;
  padding: 4px 10px;
  border: 0.4px solid ${({ borderColor }) => borderColor};
  color: ${({ textColor }) => textColor};
  font-weight: ${({ fontWeight }) => fontWeight};
  background-color: #fcfcfc;
  border-radius: 20px;
  font-size: 15px;
`;

const TypeBox = styled.div`
  width: 500px;
  padding: 4px;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  overflow: auto;
  white-space: nowrap;
  scrollbar-width: none;
`;

const HealthFindType = ({ exerciseId }) => {
  const [cate, setCate] = useState([]);
  const [items, setItems] = useState([]);

  const [cateNum, setCateNum] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [ref, inView] = useInView();

  // 메뉴 횡스크롤
  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState();

  const onDragStart = (e) => {
    e.preventDefault();
    setIsDrag(true);

    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e) => {
    if (isDrag) {
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
  };

  // 운동 종류별 반환
  const getExerType = async () => {
    await client
      .get("/exercise/categories")
      .then((res) => {
        if (res.status === 200) setCate([...res.data]);
      })
      .catch((e) => e.res);
  };
  useEffect(() => {
    getExerType();
  }, []);

  // 운동 종류별 클릭시 렌더링
  const onHandleType = async (exerciseCategoryId) => {
    setCateNum(exerciseCategoryId);
  };

  // 운동 종류별 조회 --> cateNum, page 따로
  const getCateItems = useCallback(
    async (cateNum) => {
      setLoading(true);
      await client
        .get(`/exercise/category?category=${cateNum}&page=${page}`)
        .then((res) => {
          setItems([...res.data.content]);
          // setItems((prevState) => [...prevState, ...res.data.content])
        })
        .catch((e) => {
          console.log(e);
        });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    },
    [cateNum, page],
  );
  useEffect(() => {
    getCateItems(1);
  }, []);
  // console.log(items)

  // useEffect(() => {
  //   // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
  //   if (inView && !loading) {
  //     setPage((prevState) => prevState + 1);
  //   }
  // }, [inView, loading]);

  return (
    <CardWrapper>
      <TypeBox
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        ref={scrollRef}
      >
        {cate.map((cates) => (
          <HealthButton
            {...cates}
            key={cates.exerciseCategoryId}
            onClick={() => {
              onHandleType(cates.exerciseCategoryId);
              getCateItems(cates.exerciseCategoryId);
            }}
            borderColor={
              cates.exerciseCategoryId === cateNum ? "#537cfe" : "#c9c9c9"
            }
            textColor={
              cates.exerciseCategoryId === cateNum ? "#537cfe" : "#7B7B7B"
            }
            fontWeight={
              cates.exerciseCategoryId === cateNum ? "bolder" : "normal"
            }
          >
            {/* {cates.exerciseCategoryId} */}
            {cates.exerciseCategoryName}
          </HealthButton>
        ))}
      </TypeBox>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {items.length - 1 == idx ? (
            <>
              {/* <div ref={ref}> */}
              <HealthListCard {...item} key={idx}></HealthListCard>
              {/* </div> */}
            </>
          ) : (
            <>
              <HealthListCard {...item}></HealthListCard>
            </>
          )}
        </React.Fragment>
      ))}
    </CardWrapper>
  );
};

export default HealthFindType;
