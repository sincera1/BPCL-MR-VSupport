import * as React from 'react';
import styles from './BpclMrVSupport.module.scss';
import type { IBpclMrVSupportProps } from './IBpclMrVSupportProps';
import { Carousel, Col, Container, Row, Nav, Card, Navbar, NavDropdown } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import NewsAnnouncement from '../assets/news-announcement.png';
import BDcelebration from '../assets/celebration-BD.png';
import Blueship from '../assets/blue-ship.png';

import BpclMrVSupportService, { IBusinessUnit, ISafetyDashBoardItem, ITestimonialItem, ISuccessStoryItem, IEmployeeGreetingItem, IWeeklyNoticeItem, IWelcomeBannerItem, IQuickLinkItem, ILateralMoveItem, IHolidayItem, IFavouriteLinkItem, ISafetyTipItem, ITeamOperatingPrincipleItem, IVissionMissionItem } from '../Services/BpclMrVSupportService';
import ViewAllWeeklyNotices from './ViewAllWeeklyNotices';
import ViewAllHolidayList from './ViewAllHolidayList';

const translations: any = {

  English: {

    performance: "Performance",
    quickLinks: "Quick Links",
    lateralMoves: "Lateral Moves",
    holidayList: "Holiday List",
    favouriteLinks: "Favourite Links",
    safetyTips: "Safety Tips",
    teamOperatingPrinciples: "Team Operating Principles",
    missionVisionValues: "Mission, Vision & Values",
    businessUnits: "Business Units"

  },

  Hindi: {

    performance: "परफॉर्मेंस",
    quickLinks: "त्वरित लिंक",
    lateralMoves: "लेटरल मूव्स",
    holidayList: "छुट्टियों की सूची",
    favouriteLinks: "पसंदीदा लिंक",
    safetyTips: "सुरक्षा सुझाव",
    teamOperatingPrinciples: "टीम संचालन सिद्धांत",
    missionVisionValues: "मिशन, विज़न और वैल्यूज",
    businessUnits: "बिजनेस यूनिट्स"

  },

  Marathi: {

    performance: "परफॉर्मन्स",
    quickLinks: "द्रुत लिंक",
    lateralMoves: "लेटरल मूव्ह्स",
    holidayList: "सुट्टी यादी",
    favouriteLinks: "आवडते दुवे",
    safetyTips: "सुरक्षा सूचना",
    teamOperatingPrinciples: "टीम ऑपरेटिंग प्रिन्सिपल्स",
    missionVisionValues: "मिशन, व्हिजन आणि व्हॅल्यूज",
    businessUnits: "बिझनेस युनिट्स"

  }

};



interface IVsupportState {
  directorCorner: any[];
  showModal: boolean;
  selectedItem: any;
  activeTab: string;

  isMobileMenuOpen: boolean;
  showOverflowMenus: boolean;
  businessUnits: IBusinessUnit[];
  welcomeBanners: IWelcomeBannerItem[];
  testimonials: ITestimonialItem[];
  successStories: ISuccessStoryItem[];
  safetyDashBoard: ISafetyDashBoardItem[];
  quickLinks: IQuickLinkItem[];
  lateralMoves: ILateralMoveItem[];
  favouriteLinks: IFavouriteLinkItem[];
  holidays: IHolidayItem[];
  safetyTips: ISafetyTipItem[];
  teamOperatingPrinciples: ITeamOperatingPrincipleItem[];
  vissionMission: IVissionMissionItem[];
  employeeGreetings: IEmployeeGreetingItem[];
  weeklyNotices: IWeeklyNoticeItem[];

  showWeeklyNoticesPage: boolean;
  showHolidayListPage: boolean;
}



export default class Vsupport extends React.Component<IBpclMrVSupportProps, IVsupportState> {

  private _service!: BpclMrVSupportService;

  constructor(props: IBpclMrVSupportProps) {

    super(props);

    this._service =
      new BpclMrVSupportService(
        props.context
      );

    this.state = {

      showWeeklyNoticesPage: false,
      showHolidayListPage: false,
      showModal: false,
      selectedItem: null,
      activeTab: "performanceHighlights",
      isMobileMenuOpen: false,
      showOverflowMenus: false,
      directorCorner: [],
      businessUnits: [],
      welcomeBanners: [],
      weeklyNotices: [],
      testimonials: [],
      successStories: [],
      safetyDashBoard: [],
      quickLinks: [],
      lateralMoves: [],
      holidays: [],
      favouriteLinks: [],
      safetyTips: [],
      teamOperatingPrinciples: [],
      vissionMission: [],
      employeeGreetings: [],



    };

  }

  private getWeekNumber(dateString: string): number {

    const date = new Date(dateString);

    const startOfYear = new Date(date.getFullYear(), 0, 1);

    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );

    return Math.ceil((days + startOfYear.getDay() + 1) / 7);

  }

  public async componentDidMount(): Promise<void> {

    await this.loadPageData();
    window.addEventListener(
      "languageChanged",
      this.handleLanguageChange
    );

  }

  public componentWillUnmount(): void {

    window.removeEventListener(
      "languageChanged",
      this.handleLanguageChange
    );

  }

  private async loadPageData(): Promise<void> {

    try {

      const businessUnits = await this._service.getBusinessUnits();
      const welcomeBanners = await this._service.getWelcomeBanners();
      const quickLinks = await this._service.getQuickLinks();
      const lateralMoves = await this._service.getLateralMoves();
      const holidays = await this._service.getHolidays();
      const favouriteLinks = await this._service.getFavouriteLinks();
      const safetyTips = await this._service.getSafetyTips();
      const teamOperatingPrinciples = await this._service.getTeamOperatingPrinciples();
      const employeeGreetings = await this._service.getEmployeeGreetings();
      const testimonials = await this._service.getTestimonials();
      const successStories = await this._service.getSuccessStories();
      const safetyDashBoard = await this._service.getSafetyDashBoard();
      const weeklyNotices = await this._service.getWeeklyNotices();
      const vissionMission = await this._service.getVissionMission();

      this.setState({ businessUnits, welcomeBanners, quickLinks, lateralMoves, holidays, favouriteLinks, safetyTips, teamOperatingPrinciples, employeeGreetings, testimonials, successStories, safetyDashBoard, weeklyNotices, vissionMission });

    }
    catch (error) {

      console.error("Error loading page data", error);

    }

  }

  private handleLanguageChange = (): void => {

    this.forceUpdate();

  }

  public render(): React.ReactElement<IBpclMrVSupportProps> {

    const selectedLanguage = localStorage.getItem("MRLanguage") || "English";
    const t = translations[selectedLanguage];


    if (this.state.showWeeklyNoticesPage) {
      return (
        <ViewAllWeeklyNotices
          {...this.props}
          onBack={() =>
            this.setState({
              showWeeklyNoticesPage: false
            })
          }
        />
      );
    }

    if (this.state.showHolidayListPage) {
      return (
        <ViewAllHolidayList
          {...this.props}
          onBack={() =>
            this.setState({
              showHolidayListPage: false
            })
          }
        />
      );
    }


    const performanceData = [
      {
        img: Blueship,
        title: "Transportation Fuel Approximately 75% By Volume"
      },
      {
        img: Blueship,
        title: "Refinery Grade Propylene - Benzene, Toluene"
      },
      {
        img: Blueship,
        title: "Transportation Fuel Approximately 75% By Volume"
      }
    ];






    return (
      <section>

        <Navbar expand="lg" sticky="top" className={`${styles.mainNavbar} quickLinksMenus`}>
          <Container fluid className={styles.navContainer}>

            {/* Brand */}
            {/* <Navbar.Brand className={styles.brand}>
              Sincera Consulting India PVT LTD
            </Navbar.Brand> */}

            {/* Mobile Hamburger */}
            <div
              className={styles.mobileToggle}
              onClick={() =>
                this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })
              }
            >
              <i
                className={`bi ${this.state.isMobileMenuOpen ? "bi-x-lg" : "bi-list"}`}
              />
            </div>

            {/* Menu Wrapper */}
            <div
              className={`${styles.menuWrapper} ${this.state.isMobileMenuOpen ? styles.mobileOpen : ""
                }`}
            >

              {/* First Row */}
              <div className={styles.firstRow}>

                <Nav className={styles.menuNav}>

                  {/* Home */}
                  <Nav.Link
                    href="#"
                    className={styles.menuItem}
                    onClick={() => this.setState({ isMobileMenuOpen: false })}
                  >
                    Home
                  </Nav.Link>

                  {/* About */}
                  <Nav.Link
                    href="#"
                    className={styles.menuItem}
                    onClick={() => this.setState({ isMobileMenuOpen: false })}
                  >
                    About
                  </Nav.Link>

                  {/* Services Dropdown */}
                  <NavDropdown
                    title="Services"
                    id="nav-dropdown-services"
                    className={styles.menuItem}
                  >
                    <NavDropdown.Item href="#">
                      Web Development
                    </NavDropdown.Item>

                    <NavDropdown.Item href="#">
                      SharePoint Solutions
                    </NavDropdown.Item>

                    <NavDropdown.Item href="#">
                      UI/UX Design
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Products Dropdown */}
                  <NavDropdown
                    title="Products"
                    id="nav-dropdown-products"
                    className={styles.menuItem}
                  >
                    <NavDropdown.Item href="#">
                      CRM Solution
                    </NavDropdown.Item>

                    <NavDropdown.Item href="#">
                      HR Management
                    </NavDropdown.Item>

                    <NavDropdown.Item href="#">
                      Employee Portal
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Contact */}
                  <Nav.Link
                    href="#"
                    className={styles.menuItem}
                    onClick={() => this.setState({ isMobileMenuOpen: false })}
                  >
                    Contact
                  </Nav.Link>

                </Nav>

                {/* Desktop Chevron */}
                <div
                  className={styles.chevron}
                  onClick={() =>
                    this.setState({
                      showOverflowMenus: !this.state.showOverflowMenus
                    })
                  }
                >
                  <i
                    className={`bi ${this.state.showOverflowMenus
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                      }`}
                  />
                </div>

              </div>

              {/* Second Row */}
              {this.state.showOverflowMenus && (
                <div className={styles.secondRow}>

                  <Nav className={styles.menuNav}>

                    {/* Careers */}
                    <Nav.Link
                      href="#"
                      className={styles.menuItem}
                    >
                      Careers
                    </Nav.Link>

                    {/* Resources */}
                    <Nav.Link
                      href="#"
                      className={styles.menuItem}
                    >
                      Resources
                    </Nav.Link>

                    {/* More Dropdown */}
                    <NavDropdown
                      title="More"
                      id="overflow-nav-more"
                      className={styles.menuItem}
                    >
                      <NavDropdown.Item href="#">
                        Blog
                      </NavDropdown.Item>

                      <NavDropdown.Item href="#">
                        News
                      </NavDropdown.Item>

                      <NavDropdown.Item href="#">
                        Support
                      </NavDropdown.Item>
                    </NavDropdown>

                  </Nav>

                </div>
              )}

            </div>

          </Container>
        </Navbar>

        <Container fluid className="p-0">

          {/* ================= WELCOME BANNER ================= */}
          <div className={styles.welcomeBanner}>
            <Carousel
              indicators={true}
              controls={true}
              interval={3000}
              pause={false}
            >
              {this.state.welcomeBanners.map((item) => (

                <Carousel.Item key={item.Id}>

                  <a
                    href={item.RedirectURL?.Url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >

                    <img
                      src={item.ImageUrl}
                      alt={item.Title}
                      className={styles.bannerImg}
                    />

                  </a>

                </Carousel.Item>

              ))}
            </Carousel>
          </div>

          {/* ================= PERFORMANCE SECTION ================= */}

          <Row className={styles.performanceHighlightsWrapper}>
            <Col lg={6} md={12}>

              {/* -------- Dynamic Tabs -------- */}
              <Nav
                variant="pills"
                activeKey={this.state.activeTab}
                onSelect={(key) => key && this.setState({ activeTab: key })}
                className={`${styles.customOutlinePills} flex-wrap`}
              >
                {[
                  { key: "performanceHighlights", label: "Safety Dashboard" },
                  { key: "successStories", label: "Success Stories" },
                  { key: "testimonials", label: "Testimonials" }
                ].map(tab => (
                  <Nav.Item key={tab.key}>
                    <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              {/* -------- Dynamic Carousel -------- */}
              {/* -------- Dynamic Carousel -------- */}
              <div className="tab-content p-1">

                {/* ================= SAFETY DASHBOARD ================= */}
                {this.state.activeTab === "performanceHighlights" && (
                  <Carousel
                    className={styles.customCarousel}
                    controls={false}
                    indicators={true}
                    interval={3000}
                    pause={false}
                  >
                    {this.state.safetyDashBoard.map((item) => (
                      <Carousel.Item key={item.Id}>

                        <img
                          src={item.FileRef}
                          alt="Safety Dashboard"
                          className={styles.tabCarouselImg}
                        />

                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}

                {/* ================= SUCCESS STORIES ================= */}
                {this.state.activeTab === "successStories" && (
                  <Carousel
                    className={styles.customCarousel}
                    controls={false}
                    indicators={true}
                    interval={3000}
                    pause={false}
                  >
                    {this.state.successStories.map((item) => (
                      <Carousel.Item key={item.Id}>

                        <img
                          src={item.FileRef}
                          alt="Success Story"
                          className={styles.tabCarouselImg}
                        />

                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}

                {/* ================= TESTIMONIALS ================= */}
                {this.state.activeTab === "testimonials" && (
                  <Carousel
                    className={styles.customCarousel}
                    controls={false}
                    indicators={true}
                    interval={3000}
                    pause={false}
                  >
                    {this.state.testimonials.map((item) => (
                      <Carousel.Item key={item.Id}>

                        <img
                          src={item.FileRef}
                          alt="Testimonial"
                          className={styles.tabCarouselImg}
                        />

                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}

              </div>
            </Col>


            {/* Performance */}
            <Col lg={3} md={6}>
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h5>Performance</h5>
                </div>

                <div className={styles.performanceList}>
                  {performanceData.map((item, index) => (
                    <div key={index} className={styles.performanceItem}>
                      <img src={item.img} alt="" />

                      <div className={styles.performanceContent}>
                        <p>{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.viewMore}>
                  <a href="#">View More</a>
                </div>
              </div>
            </Col>

            {/* Quick links */}
            <Col lg={3} md={6}>

              <div className={styles.sideCard}>

                <div className={styles.sideCardHeader}>
                  <h5>{t.quickLinks}</h5>
                </div>

                <div className={styles.quickLinksList}>

                  {this.state.quickLinks.map(
                    (item) => (

                      <a
                        key={item.Id}
                        href={
                          item.RedirectURL?.Url || "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          styles.quickLinkItem
                        }
                      >

                        <div className={styles.quickIcon}>

                          {item.ImageUrl ? (

                            <img
                              src={item.ImageUrl}
                              alt={item.Title}
                              width="24"
                              height="24"
                            />

                          ) : (

                            <i className="bi bi-stars" />

                          )}

                        </div>

                        <span>
                          {item.Title}
                        </span>

                      </a>

                    ))}

                </div>

              </div>

            </Col>

          </Row>

          {/* ---------------- today's birthday section ---------------- */}

          <Row>
            <Col md={12} className='px-2'>
              <div className={styles.birthdayCarouselSection}>
                <Card className={styles.messageBorderCard}>
                  <Card.Body>

                    <Carousel
                      indicators
                      controls={false}
                      interval={5000}
                      className={styles.messageCarousel}
                    >

                      {this.state.employeeGreetings.map(item => {

                        const email =
                          item.EmailID ||
                          item.EmpName?.EMail ||
                          "";

                        const profilePic =
                          `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${email}`;

                        return (

                          <Carousel.Item key={item.Id}>

                            <div className={styles.bannerCard}>

                              <div className={styles.leftContent}>

                                <img
                                  src={profilePic}
                                  alt={item.EmpName?.Title}
                                  className={styles.profileImg}
                                />

                                <div className={styles.textContent}>

                                  <h3 className={styles.name}>
                                    {item.EmpName?.Title}
                                  </h3>

                                  <p className={styles.email}>
                                    {email}
                                  </p>

                                  <p className={styles.desc}>
                                    "Happy Birthday Wishing you a fantastic day filled with joy and success. May this year bring you new opportunities and achievements. Enjoy your special day to the fullest"
                                  </p>

                                  <button className={styles.ctaBtn}>
                                    WELCOME
                                  </button>

                                </div>

                              </div>

                              <div className={styles.rightIcon}>
                                <img
                                  src={BDcelebration}
                                  alt="Celebration"
                                  width={100}
                                />
                              </div>

                            </div>

                          </Carousel.Item>

                        );

                      })}

                    </Carousel>

                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>


          {/*----------- NEWS/Event/Broadcaste BANNER ----------- */}

          <div className={styles.newsBanner}>
            <h2 className={styles.sectionHeading}>
              TEAM Entity - Announcements, Broadcasts & Events
            </h2>

            <Row>
              {/* ----------- News & Announcements ----------- */}
              <Col xs={12} md={6}>
                <div className={styles.newsannounceBanner}>
                  <div className={styles.bannerTitle}>
                    <h4>News & Announcements</h4>
                    <span className={styles.seeAll}>See All</span>
                  </div>

                  <Carousel controls={false} interval={8000} indicators>
                    <Carousel.Item>
                      <div className={styles.slide}>
                        <img
                          src={NewsAnnouncement}
                          alt="News Title"
                        />

                        <div className={styles.contentDiv}>
                          <div className={styles.announceContent}>
                            <h3>Sample News Title goes here</h3>
                            <h6>April 2026</h6>
                          </div>
                        </div>

                        <div className={styles.likeBox}>
                          <i className="bi bi-hand-thumbs-up-fill" />
                          <span className={styles.likeCount}>10</span>
                        </div>
                      </div>
                    </Carousel.Item>
                  </Carousel>
                </div>
              </Col>

              {/* ----------- Broadcasts + Events ----------- */}
              <Col xs={12} md={6}>

                {/* ----------- Broadcasts ----------- */}
                <div className={`${styles.broadcastBanner} mt-2 mt-sm-3 mt-md-0`}>
                  <div className={styles.bannerTitle}>
                    <h4>Corporate Broadcasts</h4>
                    <span className={styles.seeAll}>See All</span>
                  </div>

                  <div className={styles.verticalMarqueeWrapper}>
                    <div className={styles.verticalMarquee}>
                      <div className={styles.marqueeItem}>
                        <img
                          width={40}
                          height={40}
                          src={NewsAnnouncement}
                          alt="Broadcast"
                        />
                        <h3>Broadcast Title 1</h3>
                      </div>

                      <div className={styles.marqueeItem}>
                        <img
                          width={40}
                          height={40}
                          src={NewsAnnouncement}
                          alt="Broadcast"
                        />
                        <h3>Broadcast Title 2</h3>
                      </div>
                    </div>

                    <button className={styles.playPauseBtn}>⏸</button>
                  </div>
                </div>

                {/* ----------- Events ----------- */}
                <div className={styles.eventsBanner}>
                  <div className={styles.bannerTitle}>
                    <h4>Corporate Events</h4>
                    <span className={styles.seeAll}>See All</span>
                  </div>

                  <div className={styles.verticalEventMarqueeWrapper}>
                    <div className={styles.verticalMarquee}>
                      <div className={styles.marqueeItem}>
                        <img
                          src={NewsAnnouncement}
                          alt="Event"
                        />

                        <div className={styles.eventContent}>
                          <div className={styles.likeBox}>
                            <i className="bi bi-hand-thumbs-up-fill" />
                            <span className={styles.likeCount}>5</span>
                          </div>

                          <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                              <i className="bi bi-calendar3" />
                              <span>30 Apr 2026</span>
                            </div>
                          </div>

                          <h3>Event Title 1</h3>
                        </div>
                      </div>

                      <div className={styles.marqueeItem}>
                        <img
                          src={NewsAnnouncement}
                          alt="Event"
                        />

                        <div className={styles.eventContent}>
                          <div className={styles.likeBox}>
                            <i className="bi bi-hand-thumbs-up-fill" />
                            <span className={styles.likeCount}>8</span>
                          </div>

                          <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                              <i className="bi bi-calendar3" />
                              <span>01 May 2026</span>
                            </div>
                          </div>

                          <h3>Event Title 2</h3>
                        </div>
                      </div>
                    </div>

                    <button className={styles.playPauseBtn}>⏸</button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/*---------------- Weekly notices and mr business plans ----------------*/}


          <Row className={`${styles.parallelCarouselSection} d-flex justify-content-center mx-0`}>

            {/* ---------------- Weekly notices ---------------- */}
            <Col md={6} className="px-2 mb-3 mt-3">
              <div className={styles.weeklyNoticesCarouselSection}>
                <Card className={styles.messageBorderCard}>
                  <Card.Body>

                    <Carousel
                      indicators
                      controls={false}
                      interval={10000}
                      className={styles.governanceCarousel}
                    >

                      {this.state.weeklyNotices.map((item) => (

                        <Carousel.Item key={item.Id}>

                          <div
                            className={styles.bannerCard}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (item.FileUrl) {
                                window.open(item.FileUrl, "_blank");
                              }
                            }}
                          >

                            <div className={styles.leftContent}>

                              <div className={styles.NoticesleftCard}>

                                <h3 className={styles.NoticesName}>
                                  Week #{this.getWeekNumber(item.DateReleased)}
                                </h3>

                                <p className={styles.NoticesDate}>
                                  {new Date(item.DateReleased).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric"
                                    }
                                  )}
                                </p>

                              </div>

                              <div className={styles.rightContent}>

                                <h3 className={styles.title}>
                                  Weekly Notices
                                </h3>

                                <p
                                  className={styles.desc}
                                  style={{ WebkitLineClamp: 2 }}
                                >
                                  {item.Title}
                                </p>

                                <button
                                  type="button"
                                  className={styles.noticeBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    this.setState({
                                      showWeeklyNoticesPage: true
                                    });
                                  }}
                                >
                                  KNOW MORE
                                </button>

                              </div>

                            </div>

                          </div>

                        </Carousel.Item>

                      ))}

                    </Carousel>

                  </Card.Body>
                </Card>
              </div>
            </Col>

            {/* ---------------- mr business plans ---------------- */}
            <Col md={6} className="px-2 mb-3 mt-3">
              <div className={styles.businessPlanCarouselSection}>
                <Card className={styles.messageBorderCard}>
                  <Card.Body>

                    <Carousel
                      indicators
                      controls={false}
                      interval={12000}
                      className={styles.businessPlanCarousel}
                    >

                      {/* Slide 1 */}
                      <Carousel.Item>
                        <a
                          href="#"
                          className="text-decoration-none"
                        >
                          <div className={styles.bannerCard}>
                            <div className={styles.leftContent}>

                              <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500"
                                alt="Reports"
                                className={styles.profileImg}
                              />

                              <div className={styles.rightContent}>
                                <h3 className={styles.title}>
                                  MR Business Plan
                                </h3>

                                <p
                                  className={styles.desc}
                                  style={{ WebkitLineClamp: 2 }}
                                >
                                  Energy Efficiency & Emission Reduction Strategy Plan
                                </p>
                                <span className={styles.yearBadge}>
                                  2025-2028
                                </span>
                              </div>

                            </div>
                          </div>
                        </a>
                      </Carousel.Item>

                      {/* Slide 2 */}
                      <Carousel.Item>
                        <a
                          href="#"
                          className="text-decoration-none"
                        >
                          <div className={styles.bannerCard}>
                            <div className={styles.leftContent}>

                              <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500"
                                alt="Reports"
                                className={styles.profileImg}
                              />

                              <div className={styles.rightContent}>
                                <h3 className={styles.title}>
                                  MR Business Plan-2
                                </h3>

                                <p
                                  className={styles.desc}
                                  style={{ WebkitLineClamp: 2 }}
                                >
                                  Energy Efficiency & Emission Reduction Strategy Plan
                                </p>
                                <span className={styles.yearBadge}>
                                  2025-2028
                                </span>
                              </div>

                            </div>
                          </div>
                        </a>
                      </Carousel.Item>

                    </Carousel>

                  </Card.Body>
                </Card>
              </div>
            </Col>

          </Row>





          {/*---------------- Lateral Moves, Holiday List & Quick Links ----------------*/}

          <div className={styles.portalMainWrapper}>
            <h4 className={styles.sectionHeading}>
              Lateral Moves, Holiday List & Quick Links
            </h4>

            <Row className={styles.portalRow}>

              {/* Lateral Moves */}
              <Col lg={4} md={6} className="mb-4 d-flex">

                <div className={styles.portalInfoCard}>

                  <div className={styles.portalCardTop}>

                    <div className={styles.portalIconCircle}>
                      <i className="bi bi-arrow-left-right" />
                    </div>

                    <h4>
                      {t.lateralMoves}
                    </h4>

                  </div>

                  <div className={styles.portalListArea}>

                    {this.state.lateralMoves.map(
                      (item) => (

                        <div
                          key={item.Id}
                          className={
                            styles.portalListRow
                          }
                          onClick={() => {

                            if (
                              item.ImageUrl
                            ) {

                              window.open(
                                item.ImageUrl,
                                "_blank"
                              );

                            }

                          }}
                        >

                          <span>

                            <i className="bi bi-file-earmark-text" />

                            {item.Title}

                          </span>

                          <i className="bi bi-chevron-right" />

                        </div>

                      ))}

                  </div>

                  <button
                    className={
                      styles.portalActionBtn
                    }
                  >
                    View All
                  </button>

                </div>

              </Col>

              {/* Holiday List */}
              <Col lg={4} md={6} className="mb-4 d-flex">

                <div
                  className={`${styles.portalInfoCard} ${styles.portalBlueTheme}`}
                >

                  <div className={styles.portalCardTop}>

                    <div className={styles.portalIconCircle}>
                      <i className="bi bi-calendar-event" />
                    </div>

                    <h4>
                      {t.holidayList}
                    </h4>

                  </div>

                  <div className={styles.portalListArea}>

                    {this.state.holidays.map(
                      (item) => (

                        <div
                          key={item.Id}
                          className={
                            styles.portalListRow
                          }
                          onClick={() => {

                            if (
                              item.ImageUrl
                            ) {

                              window.open(
                                item.ImageUrl,
                                "_blank"
                              );

                            }

                          }}
                        >

                          <span>

                            <i className="bi bi-file-earmark-text" />

                            {item.Title}

                          </span>

                          <i className="bi bi-chevron-right" />

                        </div>

                      ))}

                  </div>

                  <button
                    className={styles.portalActionBtn}
                    onClick={() =>
                      this.setState({
                        showHolidayListPage: true
                      })
                    }
                  >
                    View More
                  </button>

                </div>

              </Col>

              {/* Favourite Links */}
              <Col lg={4} md={12} className="mb-4 d-flex">

                <div className={`${styles.portalInfoCard} ${styles.portalYellowTheme}`}>



                  <div className={styles.portalCardTop}>

                    <div className={styles.portalIconCircle}>
                      <i className="bi bi-link-45deg" />
                    </div>

                    <h4>
                      {t.favouriteLinks}
                    </h4>

                  </div>

                  <div className={styles.portalQuickGrid}>

                    {this.state.favouriteLinks.map(
                      (item) => (

                        <div
                          key={item.Id}
                          className={
                            styles.portalQuickBox
                          }
                          onClick={() => {

                            if (
                              item.RedirectURL?.Url
                            ) {

                              window.open(
                                item.RedirectURL.Url,
                                "_blank"
                              );

                            }

                          }}
                        >

                          <span>

                            <i className="bi bi-link-45deg" />

                            {item.Title}

                          </span>

                          <i className="bi bi-chevron-right" />

                        </div>

                      ))}

                  </div>

                </div>

              </Col>

            </Row>
          </div>


          {/*---------------- Safety tips and Team operating Principles ----------------*/}


          <Row className={`${styles.SafetyTipsCarouselSectionBG} d-flex justify-content-center mx-0`}>

            {/* ---------------- Safety tips ---------------- */}
            <Col md={6} className="px-2 mb-3 mt-3">

              <div className={styles.SafetyTipsCarouselSection}>

                <Card>

                  <Card.Body>

                    <h3 className={`${styles.title} mx-2`}>
                      {t.safetyTips}
                    </h3>

                    <Carousel
                      indicators
                      controls={false}
                      interval={10000}
                      className={
                        styles.safetyTipsCarousel
                      }
                    >

                      {this.state.safetyTips.map(
                        (item) => (

                          <Carousel.Item
                            key={item.Id}
                          >

                            <a
                              href={
                                item.FileUrl || "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >

                              <div
                                className={
                                  styles.bannerCard
                                }
                              >

                                <div
                                  className={
                                    styles.rightContent
                                  }
                                >

                                  <p
                                    className={
                                      styles.desc
                                    }
                                    style={{
                                      WebkitLineClamp: 2
                                    }}
                                  >

                                    {
                                      item.Description
                                    }

                                  </p>

                                </div>

                              </div>

                            </a>

                          </Carousel.Item>

                        ))}

                    </Carousel>

                  </Card.Body>

                </Card>

              </div>

            </Col>

            {/* ---------------- Team operating Principles ---------------- */}
            <Col md={6} className="px-2 mb-3 mt-3">

              <div className={styles.SafetyTipsCarouselSection}>

                <Card>

                  <Card.Body>

                    <h3 className={`${styles.title} mx-2`}>
                      Team Operating Principles
                    </h3>

                    <Carousel
                      indicators
                      controls={false}
                      interval={12000}
                      className={
                        styles.safetyTipsCarousel
                      }
                    >

                      {this.state.teamOperatingPrinciples.map(
                        (item) => (

                          <Carousel.Item
                            key={item.Id}
                          >

                            <a
                              href={
                                item.FileUrl || "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >

                              <div
                                className={
                                  styles.bannerCard
                                }
                              >

                                <div
                                  className={
                                    styles.rightContent
                                  }
                                >

                                  <p
                                    className={
                                      styles.desc
                                    }
                                    style={{
                                      WebkitLineClamp: 2
                                    }}
                                  >

                                    {
                                      item.Description
                                    }

                                  </p>

                                </div>

                              </div>

                            </a>

                          </Carousel.Item>

                        ))}

                    </Carousel>

                  </Card.Body>

                </Card>

              </div>

            </Col>

          </Row>


          {/* ---------------- Mission ---------------- */}

          <Row>
            <Col md={12} className="px-2">
              <div className={styles.missionContentSection}>

                {/* Header */}
                <div className={styles.missionHeader}>
                  <h4 className={styles.sectionHeading}>
                    Mission, Vision & Values
                  </h4>

                  <div className={styles.topRightControls}>
                    <button
                      className={styles.missionPrev}
                      aria-label="Previous"
                    >
                      <i className="bi bi-chevron-left" />
                    </button>

                    <button
                      className={styles.missionNext}
                      aria-label="Next"
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                </div>

                {/* Swiper */}
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={3}
                  navigation={{
                    prevEl: `.${styles.missionPrev}`,
                    nextEl: `.${styles.missionNext}`
                  }}
                  loop
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    576: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 }
                  }}
                >

                  {this.state.vissionMission.map((item) => (

                    <SwiperSlide key={item.Id}>

                      <Card className={styles.cardCommon}>

                        <Card.Body>

                          {item.ImageUrl && (
                            <img
                              src={item.ImageUrl}
                              alt={item.VMTitle}
                              width={50}
                            />
                          )}

                          <div className={styles.missionContent}>

                            <h5 className={styles.titleText}>
                              {item.VMTitle}
                            </h5>

                            <p
                              className={styles.desc}
                              style={{ WebkitLineClamp: 2 }}
                            >
                              {item.VMDescription}
                            </p>

                          </div>

                        </Card.Body>

                      </Card>

                    </SwiperSlide>

                  ))}

                </Swiper>

              </div>
            </Col>
          </Row>


          {/* ---------------- Business Units ---------------- */}

          <Row>
            <Col md={12} className="px-2 mb-3">

              <div className={styles.businessUnitsSection}>

                <h4 className={`${styles.sectionHeading} px-5`}>
                  {t.businessUnits}
                </h4>

                <div className={styles.marqueeWrapper}>

                  <div className={styles.marqueeTrack}>

                    {
                      [
                        ...this.state.businessUnits,
                        ...this.state.businessUnits
                      ].map((item, index) => {

                        return (

                          <div key={`${item.Id}_${index}`} className={styles.marqueeItem}>

                            <div
                              className={styles.unitCard}

                              style={{
                                cursor:
                                  item.RedirectURL?.Url
                                    ? "pointer"
                                    : "default"
                              }}

                              onClick={() => {

                                if (
                                  item.RedirectURL &&
                                  item.RedirectURL.Url
                                ) {

                                  window.open(
                                    item.RedirectURL.Url,
                                    "_blank"
                                  );

                                }

                              }}

                            >

                              <img
                                src={
                                  item.ImageUrl
                                    ? item.ImageUrl
                                    : NewsAnnouncement
                                }

                                alt={item.BUTitle}

                                className={styles.unitImage}

                                onError={(e) => {

                                  (
                                    e.target as HTMLImageElement
                                  ).src = NewsAnnouncement;

                                }}

                              />

                              <div className={styles.unitOverlay}>

                                <span className={styles.unitTitle}>{item.BUTitle}</span>

                              </div>

                            </div>

                          </div>

                        );

                      })

                    }

                  </div>

                </div>

              </div>

            </Col>
          </Row>

        </Container>
      </section >
    );
  }
}