import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as minutesApi from "../../apis/minutesApi";
import DOMPurify from "dompurify";
import { Button, Col, Modal, Row } from "react-bootstrap";
import dayjs from "dayjs";
import ReactDOM from "react-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const DetailMinutes = () => {
  const { minutesId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [content, setContent] = useState("");

  const [showModal, setShowModal] = useState(false);
  // const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  // 회의록 요청
  const getOneMinutes = async () => {
    try {
      const response = await minutesApi.getOneOfMinutes(minutesId);
      const minutes = response.data;

      setTitle(minutes.title);
      setAuthor(minutes.author);
      setCreatedAt(
        dayjs.utc(minutes.createdAt).local().format("YYYY-MM-DD HH:mm")
      );
      setUpdatedAt(
        dayjs.utc(minutes.updatedAt).local().format("YYYY-MM-DD HH:mm")
      );
      setContent(minutes.content);
      console.log(minutes);

      // 이미지 추출
      const parser = new DOMParser();
      const doc = parser.parseFromString(minutes.content, "text/html");
      const imgElements = doc.querySelectorAll("img");
      const imgSrcs = Array.from(imgElements).map((img) => img.src);
      setImages(imgSrcs);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  useEffect(() => {
    getOneMinutes();
  }, []);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="detail__minutes__container">
      <div className="minutes__form">
        <Row className="mb-3">
          <h4>{title}</h4>
        </Row>
        <Row className="content__header">
          <Col className="content__header__author">{author}</Col>
          <Col className="content__header__created__time">{createdAt}</Col>
        </Row>
        <Row>
          <hr />
        </Row>
        <Row className="content__body">
          {content && (
            <div
              style={{
                width: "60vw",
                whiteSpace: "normal",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(String(content)),
              }}
              onClick={(e) => {
                if (e.target.tagName === "IMG") {
                  const imgIndex = images.indexOf(e.target.src);
                  handleImageClick(imgIndex);
                }
              }}
            ></div>
          )}
        </Row>
      </div>
      <Row className="content__footer mt-5">
        <Button
          style={{ width: "fit-content" }}
          onClick={() => {
            navigate("/minutes");
          }}
        >
          목록으로
        </Button>
        <Button
          style={{ width: "fit-content", marginLeft: "15px" }}
          onClick={() => {
            navigate(`/minutes/edit/${minutesId}`);
          }}
        >
          수정
        </Button>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        dialogClassName="modal-fullscreen"
        aria-labelledby="image-modal"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header closeButton style={{ zIndex: 1051 }}>
          <Modal.Title id="image-modal">이미지 확대 보기</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 0,
            overflow: "hidden",
            position: "relative", // 이전/다음 버튼 배치를 위한 설정
          }}
        >
          <Button
            variant="light"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1052,
            }}
            onClick={handlePrevImage}
          >
            &lt;
          </Button>
          <TransformWrapper
            initialScale={1}
            doubleClick={{ mode: "reset" }}
            wheel={{ step: 0.2 }}
            minScale={1}
            maxScale={4}
            limitToBounds={true}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <img
                    src={images[selectedImageIndex]}
                    alt="확대된 이미지"
                    style={{
                      width: "80vw",
                      height: "80vh",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain", // 비율 유지하면서 모달 안에 맞춤
                      cursor: "grab",
                      userSelect: "none",
                    }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
          <Button
            variant="light"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1052,
            }}
            onClick={handleNextImage}
          >
            &gt;
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetailMinutes;
