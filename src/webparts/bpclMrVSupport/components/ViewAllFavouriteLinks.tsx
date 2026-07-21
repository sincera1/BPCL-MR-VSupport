import * as React from "react";
import {
  Button,
  Table,
  Pagination,
  Form,
  Card,
  Modal,
  Row,
  Col,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import styles from "./ViewAllFavouriteLinks.module.scss";

import { IBpclMrVSupportProps } from './IBpclMrVSupportProps';
import FavouriteLinksService from "../Services/ViewAllFavouriteLinks";
import PopupModal from "../Services/ViewAllFavouriteLinksPopupModel";

interface IFavouriteLinksProps extends IBpclMrVSupportProps {
  onBack?: () => void;
}

const ViewAllFavouriteLinks: React.FC<
  IFavouriteLinksProps
> = (props) => {
  const service = React.useMemo(
    () => new FavouriteLinksService(props.sp),
    [props.sp],
  );

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const [links, setLinks] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [editId, setEditId] = React.useState<number | null>(null);

  const [searchText, setSearchText] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  const [sortField, setSortField] = React.useState("DisplayOrder");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );

  const [showPopup, setShowPopup] = React.useState(false);
  const [popupType, setPopupType] = React.useState<"success" | "danger">(
    "success",
  );
  const [popupMessage, setPopupMessage] = React.useState("");

  const [showConfirm, setShowConfirm] = React.useState(false);

  const openAddModal = (): void => {
    setEditId(null);
    setTitle("");
    setUrl("");

    setShowAddModal(true);
  };
  const closeAddModal = (): void => setShowAddModal(false);

  const openDeleteModal = (id: number): void => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const closeDeleteModal = (): void => {
    setSelectedId(null);
    setShowConfirm(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedId) return;

    try {
      await service.deleteLink(selectedId);

      setPopupType("success");
      setPopupMessage("Favourite Link deleted successfully.");
      setShowPopup(true);

      closeDeleteModal();

      await loadLinks();
    } catch (error) {
      console.error(error);

      setPopupType("danger");
      setPopupMessage("Something went wrong. Please try again.");
      setShowPopup(true);
    }
  };

  const loadLinks = async (): Promise<void> => {
    try {

      const data = await service.getLinks(
        currentPage,
        pageSize,
        searchText,
        sortField,
        sortDirection,
        props.userId

      );

      const count = await service.getTotalCount(searchText);

      setLinks(data);
      setTotalCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadLinks().catch(console.error);
  }, [currentPage, pageSize, searchText, sortField, sortDirection]);

  const handleSave = async (): Promise<void> => {
    try {
      
      if (!title.trim() || !url.trim()) {
        closeAddModal();
        setPopupType("danger");
        setPopupMessage("Please enter Title and URL.");
        setShowPopup(true);
        return;
      }

      if (editId) {
        await service.updateLink(editId, title, url);

        setPopupType("success");
        setPopupMessage("Favourite Link updated successfully.");
      } else {
        await service.addLink(title, url);

        setPopupType("success");
        setPopupMessage("Favourite Link added successfully.");
      }

      setShowPopup(true);

      setTitle("");
      setUrl("");
      setEditId(null);

      closeAddModal();

      await loadLinks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: any): void => {
    setEditId(item.Id);

    setTitle(item.Title);

    setUrl(item.RedirectURL);

    setShowAddModal(true);
  };

  const handleSort = (field: string): void => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortDirection(direction);
  };

  const getSortIcon = (field: string): string => {
    if (sortField !== field) {
      return "bi-arrow-down-up";
    }

    return sortDirection === "asc" ? "bi-sort-down" : "bi-sort-up";
  };

  return (
    <section>
      <div className={styles.pageContainer}>
        {/* ================= ADD MODAL ================= */}
        <Modal show={showAddModal} onHide={closeAddModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editId ? "Edit Link" : "Add New Link"}
            </Modal.Title>{" "}
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className={styles.floatingLabelStyle}>
                  Title
                </Form.Label>
                {/* <Form.Control type="text" placeholder="Enter title" /> */}
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className={styles.floatingLabelStyle}>
                  URL
                </Form.Label>
                {/* <Form.Control type="url" placeholder="https://example.com" /> */}
                <Form.Control
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button className={styles.cancelBtn} onClick={closeAddModal}>
              Cancel
            </Button>

            {/* <Button className={styles.saveBtn} onClick={closeAddModal}>
            Save
          </Button> */}
            <Button className={styles.saveBtn} onClick={handleSave}>
              {editId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ================= HEADER ================= */}
        <div className={styles.banner}>

          <button
            className={styles.backIcon}
            onClick={() => props.onBack?.()}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <div className={styles.bannerIcon}>
            <i className="bi bi-link-45deg"></i>
          </div>

          <div>
            <h3>Favourite Links</h3>
            <p>
              Keep your most-used links organized and available whenever you
              need them.
            </p>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className={styles.cardContainer}>
          <Card className={styles.listCard}>
            <Card.Body className="p-4">
              <Row className="gx-3 align-items-end justify-content-between">
                <Col xl={4} lg={4} md={6} sm={12}>
                  <Form.Label className={styles.formLabel}>Search</Form.Label>
                  <Form.Control
                    type="search"
                    placeholder="Search favourite links..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Col>

                <Col
                  xl={8}
                  lg={8}
                  md={6}
                  sm={12}
                  className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0"
                >
                  <Button className={styles.primaryBtn} onClick={openAddModal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Add
                  </Button>
                </Col>
              </Row>

              <div className="table-responsive mt-4">
                <Table className={styles.listTable}>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort("DisplayOrder")}
                        style={{ cursor: "pointer" }}
                      >
                        S.No
                        <i className="bi bi-arrow-down-up ms-1 text-muted" />
                      </th>

                      <th
                        onClick={() => handleSort("Title")}
                        style={{ cursor: "pointer" }}
                      >
                        Title
                        <i className={`bi ${getSortIcon("Title")} ms-1`} />
                      </th>

                      <th
                        onClick={() => handleSort("RedirectURL")}
                        style={{ cursor: "pointer" }}
                      >
                        URL
                        <i
                          className={`bi ${getSortIcon("RedirectURL")} ms-1`}
                        />
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  {/* <tbody>
                  <tr>
                    <td>1</td>
                    <td>Google</td>
                    <td>
                      <a
                        href="https://www.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-truncate d-inline-block"
                        style={{ maxWidth: "220px" }}
                      >
                        https://www.google.com
                      </a>
                    </td>

                    <td className="d-flex flex-wrap gap-2">
                      <Button size="sm" className={styles.editBtn}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(1)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Google</td>
                    <td>
                      <a
                        href="https://www.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-truncate d-inline-block"
                        style={{ maxWidth: "220px" }}
                      >
                        https://www.google.com
                      </a>
                    </td>

                    <td className="d-flex flex-wrap gap-2">
                      <Button size="sm" className={styles.editBtn}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(1)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Google</td>
                    <td>
                      <a
                        href="https://www.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-truncate d-inline-block"
                        style={{ maxWidth: "220px" }}
                      >
                        https://www.google.com
                      </a>
                    </td>

                    <td className="d-flex flex-wrap gap-2">
                      <Button size="sm" className={styles.editBtn}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(1)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                </tbody> */}
                  <tbody>
                    {links.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No favourite links found
                        </td>
                      </tr>
                    ) : (
                      links.map((item, index) => (
                        <tr key={item.Id}>
                          <td>{(currentPage - 1) * pageSize + index + 1}</td>

                          <td>{item.Title}</td>

                          <td>
                            <a
                              href={item.RedirectURL}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.RedirectURL}
                            </a>
                          </td>

                          <td className="d-flex gap-2">
                            <Button
                              size="sm"
                              className={styles.editBtn}
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => openDeleteModal(item.Id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {/* ================= PAGINATION ================= */}
              <div className={styles.paginationSection}>
                <div className={styles.leftPagination}>
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                  </span>
                  <Form.Select
                    className={styles.pageSize}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {" "}
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </Form.Select>
                </div>

                <Pagination className="mb-0 justify-content-end flex-wrap">
                  <Pagination.First
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  />

                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />

                  {[...Array(totalPages)].slice(0, 5).map((_, index) => {
                    const pageNo = index + 1;

                    return (
                      <Pagination.Item
                        key={pageNo}
                        active={pageNo === currentPage}
                        onClick={() => setCurrentPage(pageNo)}
                      >
                        {pageNo}
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />

                  <Pagination.Last
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <PopupModal
        show={showPopup}
        type={popupType}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />
      <PopupModal
        show={showConfirm}
        type="confirm"
        message="Are you sure you want to delete this favourite link?"
        onConfirm={handleDelete}
        onClose={(result) => {
          if (result === "no") {
            setSelectedId(null);
          }

          setShowConfirm(false);
        }}
      />
    </section>
  );
};

export default ViewAllFavouriteLinks;
