import React from "react";
import { useRef } from "react";
import styled from "styled-components";

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;

const ItemImgTitleWrapper = styled.div`
  cursor: pointer;
  display: flex;
`;

const ItemImgWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-right: 14px;
  font-size: 20px;
  & img {
    width: 100%;
    height: 100%;
  }
  @media screen and (max-width: 280px) {
    width: 40px;
    height: 40px;
  }
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  line-height: 20px;
`;

const ItemTitle = styled.p`
  white-space: nowrap;
  overflow: hidden;
  max-width: 220px;
  text-overflow: ellipsis;
  font-size: 16px;
  width: 100%;
  & + span {
    font-size: 14px;
  }
  & + span i {
    color: blue;
    margin-right: 5px;
  }
  @media screen and (max-width: 280px) {
    font-size: 14px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & button {
    font-size: 20px;
    background-color: transparent;
  }
`;

const UserInfoListItem = ({
  relatedItemId,
  name,
  img,
  rating,
  infoType,
  children,
  onClick,
}) => {
  const itemRef = useRef();
  return (
    <ItemWrapper ref={itemRef}>
      <ItemImgTitleWrapper onClick={onClick}>
        <ItemImgWrapper>
          {img !== "" && img !== undefined ? (
            <img src={img} alt="이미지 준비중" />
          ) : infoType === "pill" ? (
            <i className="fa-regular fa-pills"></i>
          ) : (
            <i className="fa-sharp fa-solid fa-person-walking"></i>
          )}
        </ItemImgWrapper>
        <ItemTitleWrapper>
          <ItemTitle>{name}</ItemTitle>
          {rating !== undefined ? (
            <span>
              <i className="fa-solid fa-star"></i>
              {parseInt(rating).toFixed(1)}
            </span>
          ) : (
            <></>
          )}
        </ItemTitleWrapper>
      </ItemImgTitleWrapper>
      <ButtonWrapper>{children}</ButtonWrapper>
    </ItemWrapper>
  );
};

export default React.memo(UserInfoListItem);
