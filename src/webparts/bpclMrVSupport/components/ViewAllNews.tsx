import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./ViewAllPagesCommon.module.scss";

import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  Row,
  Col,
  Form,
  Button,
  Pagination
} from "react-bootstrap";

import { IBpclMrVSupportProps } from "./IBpclMrVSupportProps";
import ViewAllNewsService, { INewsItem } from "../Services/ViewAllNews";
import PopupModal from './PopupModal';

interface IViewAllNewsProps extends IBpclMrVSupportProps {
  onBack?: () => void;
}

const ViewAllNews = (props: IViewAllNewsProps): React.ReactElement => {

  const [newsCards, setNewsCards] = useState<INewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async (): Promise<void> => {
    try {

      setLoading(true);

      const service = new ViewAllNewsService(props.context);

      const data = await service.getCorporateNews();

      setNewsCards(data);
      setFilteredNews(data);

    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (): void => {

    // At least From Date is mandatory
    if (!fromDate) {
      setPopupMessage("Please select From Date.");
      setShowPopup(true);
      return;
    }

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    let filtered = [];

    // If To Date is selected, filter by range
    if (toDate) {

      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      // Validate date range
      if (from > to) {
        setPopupMessage("From Date cannot be greater than To Date.");
        setShowPopup(true);
        return;
      }

      filtered = newsCards.filter(item => {
        const published = new Date(item.PublishedDate);
        return published >= from && published <= to;
      });

    } else {

      // Only From Date selected - show news for that date
      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      filtered = newsCards.filter(item => {
        const published = new Date(item.PublishedDate);
        return published >= from && published <= endOfDay;
      });
    }

    if (filtered.length === 0) {
      setPopupMessage("No news found for the selected date.");
      setShowPopup(true);
    }

    setFilteredNews(filtered);
  };

  return (
    <div className={styles.pageContainer}>

      {/* Banner */}

      <div className={styles.banner}>

        <button
          className={styles.backIcon}
          onClick={() => {
            if (props.onBack) {
              props.onBack();
            } else {
              window.history.back();
            }
          }}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className={styles.bannerIcon}>
          <i className="bi bi-newspaper"></i>
        </div>

        <div>
          <h3>News & Announcements</h3>
          <p>
            Stay informed with the latest organizational news, important announcements,
            updates, and key developments.
          </p>
        </div>

      </div>

      <div className={styles.cardContainer}>

        <Row className="gx-3 mb-5 align-items-end">

          <Col xl={4} lg={4} md={6} sm={12}>
            <Form.Label className={styles.formLabel}>From</Form.Label>
            <div className={styles.dateBox}>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate || undefined}
              />
            </div>
          </Col>

          <Col xl={4} lg={4} md={6} sm={12}>
            <Form.Label className={styles.formLabel}>To</Form.Label>
            <div className={styles.dateBox}>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || undefined}
              />
            </div>
          </Col>

          <Col xl={2} lg={4} md={12} sm={12}>
            <Button className={`w-100 mt-sm-3 ${styles.searchBtn}`} onClick={handleSearch}>
              <i className="bi bi-search me-2"></i>
              Search
            </Button>
          </Col>

          <Col xl={2} lg={4} md={12} sm={12}>
            <Button
              variant="secondary"
              className="w-100 mt-sm-3"
              onClick={() => {
                setFromDate("");
                setToDate("");
                setFilteredNews(newsCards);
              }}
            >
              Reset
            </Button>
          </Col>

        </Row>

        {loading && (
          <div className="text-center mb-4">
            Loading...
          </div>
        )}

        <Row className="gx-3">

          {!loading && filteredNews.length === 0 && (
            <Col xs={12}>
              <div className="text-center">
                No News Available
              </div>
            </Col>
          )}

          {filteredNews.map((card) => (

            <Col
              xl={3}
              lg={3}
              md={6}
              sm={12}
              className="mb-4 d-flex"
              key={card.Id}
            >

              <a
                href="#"
                className={styles.newsCard}
                onClick={(e) => {
                  e.preventDefault();

                  if (card.FileUrl) {
                    // Open PDF if available
                    window.open(card.FileUrl, "_blank", "noopener,noreferrer");
                  } else if (card.ImageUrl) {
                    // Otherwise open the image
                    window.open(card.ImageUrl, "_blank", "noopener,noreferrer");
                  }
                }}
              >

                <div className={styles.cardImageWrapper}>

                  <img
                    src={card.ImageUrl}
                    alt={card.Title}
                    className={styles.cardImage}
                  />

                  <div className={styles.cardOverlay}>

                    <h6
                      className={styles.cardTitle}
                      title={card.Title}
                    >
                      {card.Title}
                    </h6>

                    <div className={styles.cardDate}>
                      <i className="bi bi-calendar3"></i>
                      <span>
                        {new Date(card.PublishedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                  </div>

                </div>

              </a>

            </Col>

          ))}

        </Row>

        {/* Footer */}

        <div className={styles.paginationSection}>

          <div className={styles.leftPagination}>

            <span className={styles.pageInfo}>
              Page 1 of 1
            </span>

            <Form.Select className={styles.pageSize}>
              <option>10 per page</option>
              <option>20 per page</option>
              <option>50 per page</option>
            </Form.Select>

          </div>

          <Pagination className="mb-0 justify-content-end flex-wrap">

            <Pagination.First />
            <Pagination.Prev />

            <Pagination.Item active>1</Pagination.Item>

            <Pagination.Next />
            <Pagination.Last />

          </Pagination>

        </div>

      </div>

      <PopupModal
        show={showPopup}
        type="danger"
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />

    </div>
  );
};

export default ViewAllNews;