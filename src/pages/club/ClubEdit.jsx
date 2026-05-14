import React, { useMemo } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import TNInput from "../../component/TNInput";
import { useNavigate, useParams } from "react-router-dom";
import { useClub, useEditClub, useListCategories } from "../../hooks/useRQClub";
import TabNav from "../../components/TabNav";

const ClubEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreate = id === "new" || !id;

  const { data: serverData, isLoading } = useClub(!isCreate ? id : undefined);
  const clubData = useMemo(
    () => (serverData && (serverData.data || serverData)) || null,
    [serverData]
  );
  const { data: categories, isLoading: categoriesLoading } =
    useListCategories();
  let categoriesOptions;
  if (!categoriesLoading && categories && categories.data) {
    categoriesOptions = categories.data?.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("name is required"),
    category_id: Yup.number()
      .typeError("category_id must be a number")
      .required("category_id is required"),
    description: Yup.string().nullable(),
    club_profile_image: Yup.string()
      .url("must be a valid URL")
      .nullable()
      .optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: clubData?.name || "",
      category_id: clubData?.category_id || "",
      description: clubData?.description || "",
      is_public: !!clubData?.is_public,
      allow_member_to_post: !!clubData?.allow_member_to_post,
      club_profile_image: clubData?.club_profile_image || "",
    },
    validationSchema,
    onSubmit: (values) => {
      editClub({ id, payload: values });
    },
    enableReinitialize: true,
  });

  const { mutate: editClub, isPending: savingEdit } = useEditClub(() =>
    navigate("/clubs")
  );

  return (
    <div className="edit-profile-page">
      <h2 className="page-title mb-3">
        {isCreate ? "Create Club" : "Edit Club"}
      </h2>
      {!isCreate && (
        <TabNav items={[{ label: "Details", to: `/clubs/${id}/edit` }]} />
      )}

      <Card className="profile-card shadow-sm">
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="g-3">
              <Col md={6} xs={12}>
                <TNInput
                  label="Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                  placeholder="e.g., Photography Club"
                />
              </Col>
              <Col md={6} xs={12}>
                <TNInput
                  type="select"
                  label="Category"
                  name="category_id"
                  value={formik.values.category_id}
                  options={categoriesOptions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                  placeholder="Select category"
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} xs={12}>
                <TNInput
                  label="Description"
                  name="description"
                  type="textarea"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                  placeholder="Short description"
                />
              </Col>
              <Col md={6} xs={12}>
                <TNInput
                  label="Profile Image URL"
                  name="club_profile_image"
                  value={formik.values.club_profile_image}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors}
                  touched={formik.touched}
                  placeholder="https://..."
                />
              </Col>
              <Col md={6} xs={12} className="mt-3">
                <div className="form-group custom-input">
                  <Form.Check
                    type="switch"
                    id="is_public"
                    label="Public Club"
                    checked={!!formik.values.is_public}
                    onChange={(e) =>
                      formik.setFieldValue("is_public", e.target.checked)
                    }
                  />
                </div>
                <div className="form-group custom-input">
                  <Form.Check
                    type="switch"
                    id="allow_member_to_post"
                    label="Allow Members to Post"
                    checked={!!formik.values.allow_member_to_post}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "allow_member_to_post",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row></Row>

            <div className="d-flex justify-content-end mt-3 gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={savingEdit || isLoading}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClubEdit;
