import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Image, Spinner } from "react-bootstrap";
// import { useGetFrontLogo, useUpdateFrontLogo } from "../../hooks/useRQsettings";
import { fileToDataUri } from "../../helpers/commonHelpers";

const STORAGE_KEY = "front_logo";

const Logo = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !file) {
      setPreview(stored);
    }
    setIsFetching(false);
  }, [file]);

  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const uri = await fileToDataUri(f);
    setPreview(uri);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !preview) return;
    setIsPending(true);
    localStorage.setItem(STORAGE_KEY, preview);
    window.dispatchEvent(new Event("front_logo_updated"));
    setIsPending(false);
    setFile(null);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row className="g-3 align-items-center">
        <Col xs={12} md={6}>
          <Form.Group controlId="formFrontLogo">
            <Form.Label>Front-side Logo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            <Form.Text muted>PNG/SVG recommended. Max 1MB.</Form.Text>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} className="text-center">
          <div className="logo-preview">
            {isFetching && !preview ? (
              <Spinner animation="border" size="sm" />
            ) : preview ? (
              <Image
                src={preview}
                alt="Logo preview"
                fluid
                className="preview-img"
              />
            ) : (
              <div className="placeholder">No logo</div>
            )}
          </div>
        </Col>
      </Row>
      <div className="d-flex justify-content-end mt-3 gap-2">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setFile(null)}
          disabled={isPending}
        >
          Reset
        </Button>
        <Button variant="primary" type="submit" disabled={!file || isPending}>
          {isPending ? "Saving..." : "Save Logo"}
        </Button>
      </div>
    </Form>
  );
};

export default Logo;
