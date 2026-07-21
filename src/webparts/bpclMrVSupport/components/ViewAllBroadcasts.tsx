import * as React from 'react';
import styles from "./ViewAllPagesCommon.module.scss";
import { useEffect, useState } from "react";
import '@fontsource/inter';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
    Row,
    Col,
    Form,
    Button,
    Pagination
} from 'react-bootstrap';

import { IBpclMrVSupportProps } from "./IBpclMrVSupportProps";
import ViewAllBroadcastsService, { IBroadcastItem } from "../Services/ViewAllBroadcasts";
import PopupModal from './PopupModal';

interface IViewAllBroadcastsProps extends IBpclMrVSupportProps {
    onBack?: () => void;
}



const ViewAllBroadcasts = (props: IViewAllBroadcastsProps): React.ReactElement => {

    const [broadcastCards, setBroadcastCards] = useState<IBroadcastItem[]>([]);
    const [filteredBroadcasts, setFilteredBroadcasts] = useState<IBroadcastItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        loadBroadcasts();
    }, []);

    const loadBroadcasts = async (): Promise<void> => {

        try {

            setLoading(true);

            const service = new ViewAllBroadcastsService(props.context);

            const data = await service.getBroadcasts();

            setBroadcastCards(data);
            setFilteredBroadcasts(data);

        } catch (error) {

            console.error("Error loading broadcasts:", error);

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
            filtered = broadcastCards.filter(item => {
                const published = new Date(item.PublishedDate);
                return published >= from && published <= to;
            });

        } else {

            // Only From Date selected - filter for that day
            const endOfDay = new Date(from);
            endOfDay.setHours(23, 59, 59, 999);

            filtered = broadcastCards.filter(item => {
                const published = new Date(item.PublishedDate);
                return published >= from && published <= endOfDay;
            });

        }

        if (filtered.length === 0) {
            setPopupMessage("No broadcasts found for the selected date.");
            setShowPopup(true);
        }

        setFilteredBroadcasts(filtered);
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
                    <i className="bi bi-broadcast"></i>
                </div>

                <div>
                    <h3>Broadcasts</h3>
                    <p>
                        Access important broadcast messages, organization-wide
                        communications, and timely updates from leadership.
                    </p>
                </div>

            </div>

            <div className={styles.cardContainer}>

                {/* Filters */}

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
                        <Button
                            className={`w-100 mt-sm-3 ${styles.searchBtn}`}
                            onClick={handleSearch}
                        >
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
                                setFilteredBroadcasts(broadcastCards);
                            }}
                        >
                            Reset
                        </Button>
                    </Col>

                </Row>

                {/* Loading */}

                {loading && (
                    <div className="text-center mb-4">
                        Loading...
                    </div>
                )}

                {/* Broadcast Cards */}

                <Row className="gx-3">

                    {!loading && filteredBroadcasts.length === 0 && (
                        <Col xs={12}>
                            <div className="text-center">
                                No Broadcasts Available
                            </div>
                        </Col>
                    )}

                    {filteredBroadcasts.map((card) => (

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
                                className={`h-100 text-decoration-none ${styles.broadcastCard}`}
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (card.ImageUrl) {
                                        window.open(card.ImageUrl, "_blank", "noopener,noreferrer");
                                    }
                                }}
                            >

                                <div className={styles.broadcastBody}>

                                    <div className={styles.broadcastIcon}>
                                        <i className="bi bi-broadcast"></i>
                                    </div>

                                    <h6
                                        className={styles.broadcastTitle}
                                        title={card.Title}
                                    >
                                        {card.Title}
                                    </h6>

                                    <div className={styles.broadcastDate}>
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

export default ViewAllBroadcasts;