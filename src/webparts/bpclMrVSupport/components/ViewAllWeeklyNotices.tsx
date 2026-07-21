import * as React from 'react';
import styles from './ViewAllPagesCommon.module.scss';
import '@fontsource/inter';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Card, Row, Col, Form, Button, Table, Pagination } from "react-bootstrap";

import { IBpclMrVSupportProps } from './IBpclMrVSupportProps';
import PopupModal from './PopupModal';

import ViewAllWeeklyNoticesService, { IWeeklyNoticeItem } from '../Services/ViewAllWeeklyNotices';

interface IWeeklyNoticesProps extends IBpclMrVSupportProps {
  onBack?: () => void;
}

const WeeklyNotices: React.FC<IWeeklyNoticesProps> = (props) => {

  const [notices, setNotices] = React.useState<IWeeklyNoticeItem[]>([]);
  const [filteredNotices, setFilteredNotices] = React.useState<IWeeklyNoticeItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [sortAsc, setSortAsc] = React.useState<boolean>(true);
  const [showPopup, setShowPopup] = React.useState<boolean>(false);
  const [popupMessage, setPopupMessage] = React.useState<string>("");

  const service = React.useMemo(() => new ViewAllWeeklyNoticesService(props.sp, props.context), [props.sp, props.context]);

  React.useEffect(() => { loadWeeklyNotices().catch(console.error); }, []);

  const loadWeeklyNotices = async (): Promise<void> => {
    try {

      setLoading(true);

      const data = await service.getWeeklyNotices();

      setNotices(data);
      setFilteredNotices(data);

    } catch (error) {

      console.error("Error loading weekly notices:", error);

    } finally {

      setLoading(false);

    }
  };

  const handleSearch = (): void => {

    // From Date is mandatory
    if (!fromDate) {
      setPopupMessage("Please select From Date.");
      setShowPopup(true);
      return;
    }

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    let filtered = [];

    if (toDate) {

      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      // Validate date range
      if (from > to) {
        setPopupMessage("From Date cannot be greater than To Date.");
        setShowPopup(true);
        return;
      }

      // Filter by date range
      filtered = notices.filter(item => {
        const released = new Date(item.DateReleased);
        return released >= from && released <= to;
      });

    } else {

      // Only From Date selected - filter for that specific day
      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      filtered = notices.filter(item => {
        const released = new Date(item.DateReleased);
        return released >= from && released <= endOfDay;
      });

    }

    if (filtered.length === 0) {
      setPopupMessage("No notices found for the selected date.");
      setShowPopup(true);
    }

    setFilteredNotices(filtered);
  };

  const handleSortByDate = (): void => {

    const sorted = [...filteredNotices].sort((a, b) => {

      const dateA = new Date(a.DateReleased).getTime();
      const dateB = new Date(b.DateReleased).getTime();

      return sortAsc
        ? dateA - dateB
        : dateB - dateA;

    });

    setFilteredNotices(sorted);
    setSortAsc(!sortAsc);
  };

  const handleSortByTitle = (): void => {

    const sorted = [...filteredNotices].sort((a, b) => {

      return sortAsc
        ? a.Title.localeCompare(b.Title)
        : b.Title.localeCompare(a.Title);

    });

    setFilteredNotices(sorted);
    setSortAsc(!sortAsc);
  };

  const formatDate = (dateValue: string): string => {

    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  };


  return (
    <div className={styles.pageContainer}>

      <div className={styles.banner}>
        <button
          className={styles.backIcon}
          onClick={() => props.onBack?.()}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className={styles.bannerIcon}>
          <i className="bi bi-megaphone-fill"></i>
        </div>

        <div>
          <h3>Weekly Notices</h3>
          <p>
            Stay updated with the latest official notices and announcements.
          </p>
        </div>
      </div>

      <div className={styles.cardContainer}>
        <Card className={styles.listCard}>

          <Card.Body className='p-4'>

            <Row className="gx-3 align-items-end">

              <Col xl={4} lg={4} md={6} sm={12}>
                <Form.Label className={styles.formLabel}>From</Form.Label>
                <div className={styles.dateBox}>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
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
                    setFilteredNotices(notices);
                  }}
                >
                  Reset
                </Button>
              </Col>

            </Row>

            <div className="table-responsive mt-4">
              <Table hover className={styles.listTable}>

                <thead>
                  <tr>
                    <th style={{ cursor: "pointer" }} onClick={handleSortByTitle}>
                      Title
                      <i className="bi bi-arrow-down-up ms-2"></i>
                    </th>

                    <th style={{ cursor: "pointer" }} onClick={handleSortByDate}>
                      Date Released
                      <i className="bi bi-arrow-down-up ms-2"></i>
                    </th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredNotices.length > 0 ? (

                    filteredNotices.map((item) => (

                      <tr key={item.Id}>

                        <td>
                          <i className={`bi bi-file-earmark-pdf-fill ${styles.pdfIcon}`}></i>

                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();

                              if (item.FileUrl) {
                                const url = item.FileUrl.startsWith("http")
                                  ? item.FileUrl
                                  : `${window.location.origin}${item.FileUrl}`;

                                window.open(url, "_blank", "noopener,noreferrer");
                              }
                            }}
                          >
                            {item.Title}
                          </a>
                        </td>

                        <td>
                          {formatDate(item.DateReleased)}
                        </td>

                        <td className="text-end">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();

                              if (item.FileUrl) {
                                window.open(item.FileUrl, "_blank", "noopener,noreferrer");
                              }
                            }}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </a>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan={3} className="text-center">
                        No data to display.
                      </td>
                    </tr>

                  )}

                </tbody>

              </Table>
            </div>

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
                <Pagination.First disabled />
                <Pagination.Prev disabled />
                <Pagination.Item active>1</Pagination.Item>
                <Pagination.Next disabled />
                <Pagination.Last disabled />
              </Pagination>

            </div>

          </Card.Body>

        </Card>
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

export default WeeklyNotices;