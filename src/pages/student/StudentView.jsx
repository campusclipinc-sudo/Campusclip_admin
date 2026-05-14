// StudentView.jsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Card, Button, Spinner, Image, Badge } from "react-bootstrap";
import DetailField from "../../components/DetailField";
import TNTable from "../../component/TNTable";
import {
  useStudent,
  useStudentPosts,
  useStudentClasses,
  useStudentClubs,
} from "../../hooks/useRQStudent";
import FeedItem from "../../components/feedCard/FeedItem";
import { NAV_TABS, GRADE_FORMATS, DEFAULT_TAB } from "../../utils/contant";
import { formatDate } from "../../helpers";
import TabNav from "../../components/TabNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import StudentService from "../../api/studentService";

const StudentView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useStudent(id);
  const student = data?.data || {};
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [postsPageIndex, setPostsPageIndex] = useState(0);
  const [classesPageIndex, setClassesPageIndex] = useState(0);
  const [clubsPageIndex, setClubsPageIndex] = useState(0);

  // Build params for posts API
  const postsParams = useMemo(
    () => ({
      page: postsPageIndex + 1,
      limit: 10,
    }),
    [postsPageIndex]
  );

  // Build params for classes API
  const classesParams = useMemo(
    () => ({
      page: classesPageIndex + 1,
      limit: 10,
    }),
    [classesPageIndex]
  );

  // Build params for clubs API
  const clubsParams = useMemo(
    () => ({
      page: clubsPageIndex + 1,
      limit: 10,
    }),
    [clubsPageIndex]
  );

  // Fetch data for each tab only when the tab is active
  const { data: postsDataResponse, isLoading: isLoadingPosts } =
    useStudentPosts(id, postsParams, activeTab === "posts");
  const { data: classesDataResponse, isLoading: isLoadingClasses } =
    useStudentClasses(id, classesParams, activeTab === "classes");
  const { data: clubsDataResponse, isLoading: isLoadingClubs } =
    useStudentClubs(id, clubsParams, activeTab === "clubs");

  const formatGradeDisplay = (format) => {
    if (!format) return "-";
    return GRADE_FORMATS[format] || format;
  };

  const formatPrivacy = (privacy) => {
    if (privacy === undefined || privacy === null) return "-";
    return privacy === 0 || privacy === "0" ? "Public" : "Private";
  };

  const getSchoolName = () => {
    return student?.educational_institution?.name || student?.university || "-";
  };

  // Classes table columns
  const classesColumns = useMemo(
    () => [
      {
        accessorKey: "class_name",
        header: "Class Name",
      },
      {
        accessorKey: "class_code",
        header: "Code",
      },
      {
        accessorKey: "instructor_name",
        header: "Teacher/Instructor",
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ getValue }) => formatDate(getValue()),
      },
    ],
    []
  );

  // Clubs table columns
  const clubsColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Club Name",
      },
      {
        accessorKey: "club_profile_image",
        header: "Image",
        cell: ({ row }) => {
          const club = row.original;
          const imageUrl =
            club.club_profile_image ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=50&h=50&fit=crop";
          return (
            <Image
              src={imageUrl}
              alt={club.name || "Club"}
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category/Type",
        cell: ({ row }) => {
          const club = row.original;
          return club.category?.name || club.category_id || "-";
        },
      },
    ],
    []
  );

  // Prepare data for posts - use API data when available
  const postsData = useMemo(() => {
    if (activeTab === "posts" && postsDataResponse?.data) {
      // Check if response has pagination structure
      if (postsDataResponse.data.posts) {
        return Array.isArray(postsDataResponse.data.posts)
          ? postsDataResponse.data.posts
          : [];
      }
      // Fallback for old response format (array)
      return Array.isArray(postsDataResponse.data)
        ? postsDataResponse.data
        : [];
    }
    return Array.isArray(student.posts) ? student.posts : [];
  }, [activeTab, postsDataResponse?.data, student.posts]);

  const classesData = useMemo(() => {
    if (activeTab === "classes" && classesDataResponse?.data) {
      // Check if response has pagination structure
      if (classesDataResponse.data.classes) {
        return Array.isArray(classesDataResponse.data.classes)
          ? classesDataResponse.data.classes
          : [];
      }
      // Fallback for old response format (array)
      return Array.isArray(classesDataResponse.data)
        ? classesDataResponse.data
        : [];
    }
    return Array.isArray(student.classes) ? student.classes : [];
  }, [activeTab, classesDataResponse?.data, student.classes]);

  const clubsData = useMemo(() => {
    if (activeTab === "clubs" && clubsDataResponse?.data) {
      // Check if response has pagination structure
      if (clubsDataResponse.data.clubs) {
        return Array.isArray(clubsDataResponse.data.clubs)
          ? clubsDataResponse.data.clubs
          : [];
      }
      // Fallback for old response format (array)
      return Array.isArray(clubsDataResponse.data)
        ? clubsDataResponse.data
        : [];
    }
    return Array.isArray(student.clubs) ? student.clubs : [];
  }, [activeTab, clubsDataResponse?.data, student.clubs]);

  // Common table props
  const tableProps = {
    paginationData: null,
    onSelectPage: () => {},
  };

  // Get classes pagination data
  const classesPagination = useMemo(() => {
    if (activeTab === "classes" && classesDataResponse?.data?.pagination) {
      const pagination = classesDataResponse.data.pagination;
      return {
        total: pagination.total,
        per_page: pagination.limit,
        last_page: pagination.totalPages,
      };
    }
    return null;
  }, [activeTab, classesDataResponse?.data?.pagination]);

  // Get clubs pagination data
  const clubsPagination = useMemo(() => {
    if (activeTab === "clubs" && clubsDataResponse?.data?.pagination) {
      const pagination = clubsDataResponse.data.pagination;
      return {
        total: pagination.total,
        per_page: pagination.limit,
        last_page: pagination.totalPages,
      };
    }
    return null;
  }, [activeTab, clubsDataResponse?.data?.pagination]);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsTab();
      case "posts":
        return renderPostsTab();
      case "classes":
        return renderClassesTab();
      case "clubs":
        return renderClubsTab();
      default:
        return null;
    }
  };

  const renderDetailsTab = () => (
    <>
      {/* Card header: avatar + main info */}
      <Card.Body className="pb-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
              style={{
                width: 72,
                height: 72,
                background: "linear-gradient(135deg, #4c6fff 0%, #9b51e0 100%)",
                color: "#fff",
              }}
            >
              {student.profile_image ? (
                <Image
                  src={student.profile_image}
                  alt={student.full_name || "Profile"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span className="fs-3 fw-bold">
                  {(student.full_name || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h4 className="mb-1">{student.full_name || "Student"}</h4>
            </div>
          </div>
          <div className="text-end">
            <Badge
              bg={
                formatPrivacy(student.account_privacy) === "Public"
                  ? "success"
                  : "secondary"
              }
              pill
              className="mb-2"
            >
              {formatPrivacy(student.account_privacy)} account
            </Badge>
          </div>
        </div>
        {/* Stats: Posts, Followers, Following */}
        <div className="d-flex justify-content-center gap-4 mt-3 pt-3 border-top">
          <div className="text-center">
            <div className="fw-bold fs-5">{student.posts_count ?? 0}</div>
            <div className="text-muted small">Posts</div>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-5">{student.followers_count ?? 0}</div>
            <div className="text-muted small">Followers</div>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-5">{student.following_count ?? 0}</div>
            <div className="text-muted small">Following</div>
          </div>
        </div>
      </Card.Body>

      {/* Card content: sections in one card */}
      <Card.Body>
        {/* Contact & personal */}
        <div className="mb-4">
          <Row>
            <DetailField label="Full Name" value={student.full_name} span={4} />
            <DetailField
              label="Display Name"
              value={student.full_name}
              span={4}
            />
            <DetailField label="Email Address" value={student.email} span={4} />
            <DetailField
              label="Phone Number"
              value={student.phone_number}
              span={4}
            />
            <DetailField
              label="Username"
              value={student.username && `@${student.username}`}
              span={4}
            />
            <DetailField
              label="Date of Birth"
              value={formatDate(student.birthday)}
              span={4}
            />
            <DetailField label="City" value={student.city} span={4} />
            <DetailField
              label="Bio"
              value={student.bio}
              span={12}
              valueClassName="text-break"
            />
          </Row>
        </div>

        {/* Academic */}
        <div className="mb-4">
          <Row>
            <DetailField label="University" value={getSchoolName()} span={4} />
            <DetailField
              label="Year of study"
              value={student.academic_year}
              span={4}
            />
            <DetailField
              label="Program / Course"
              value={student.major}
              span={4}
            />
            <DetailField
              label="Grade Display Format"
              value={formatGradeDisplay(student.grade_display_format)}
              span={4}
            />
          </Row>
        </div>
      </Card.Body>
    </>
  );

  const renderPostsTab = () => {
    if (isLoadingPosts) {
      return (
        <Card.Body>
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" />
          </div>
        </Card.Body>
      );
    }

    if (postsData.length === 0) {
      return (
        <Card.Body>
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No posts found</p>
          </div>
        </Card.Body>
      );
    }

    // Transform posts into feed format expected by FeedItem
    const feed = postsData.map((post) => ({
      type: "post",
      id: post.id,
      data: post,
    }));

    // Extract pagination if available (backend may not support it yet)
    const postsPagination = postsDataResponse?.data?.pagination || null;

    return (
      <Card.Body>
        <div className="feed-list">
          {feed.map((item) => (
            <FeedItem
              key={`${item.type}-${item.id}`}
              item={item}
              onDeleteEvent={() => {}}
            />
          ))}
        </div>
        {/* Pagination Controls - will work when backend supports pagination */}
        {postsPagination && postsPagination.totalPages > 1 && (
          <div className="feed-pagination mt-4">
            <Button
              variant="primary"
              size="sm"
              disabled={postsPageIndex === 0}
              onClick={() => setPostsPageIndex(postsPageIndex - 1)}
            >
              Previous
            </Button>
            <span className="page-info mx-3">
              Page {postsPagination.page} of {postsPagination.totalPages}
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={postsPageIndex >= postsPagination.totalPages - 1}
              onClick={() => setPostsPageIndex(postsPageIndex + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card.Body>
    );
  };

  const renderClassesTab = () => (
    <Card.Body>
      {isLoadingClasses ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" />
        </div>
      ) : classesData.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="mb-0">No classes found</p>
        </div>
      ) : (
        <TNTable
          columns={classesColumns}
          data={Array.isArray(classesData) ? classesData : []}
          paginationData={classesPagination}
          onSelectPage={(p) => setClassesPageIndex(p)}
          pageIndexGet={classesPageIndex}
          idName="student-classes"
        />
      )}
    </Card.Body>
  );

  const renderClubsTab = () => (
    <Card.Body>
      {isLoadingClubs ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" />
        </div>
      ) : clubsData.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="mb-0">No clubs found</p>
        </div>
      ) : (
        <TNTable
          columns={clubsColumns}
          data={Array.isArray(clubsData) ? clubsData : []}
          paginationData={clubsPagination}
          onSelectPage={(p) => setClubsPageIndex(p)}
          pageIndexGet={clubsPageIndex}
          idName="student-clubs"
        />
      )}
    </Card.Body>
  );

  const handleExport = async () => {
    try {
      if (!id) {
        toast.error("Student ID is required");
        return;
      }

      // toast.info("Generating CSV with all student details...");

      // Export single student with all details
      await StudentService.exportStudentDetails(id);

      toast.success("Student details exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to export student details"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div
      className="student-view-page"
      style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1 fw-bold">Student Details</h2>
          <div className="text-muted small">ID: {student.id || id}</div>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={handleExport}
            disabled={isLoading || !student.id}
          >
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            Export CSV
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/students/${id}/edit`)}
          >
            Edit Student
          </Button>
        </div>
      </div>

      <Card className="mt-3 shadow-sm border-0">
        <Card.Header className="bg-white">
          <TabNav
            items={NAV_TABS.map((tab) => ({
              label: tab.label,
              eventKey: tab.key,
            }))}
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || DEFAULT_TAB)}
          />
        </Card.Header>
        {renderTabContent()}
      </Card>
    </div>
  );
};

export default StudentView;
