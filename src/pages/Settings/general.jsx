import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TNInput from "../../component/TNInput";
import { useGetSettings, useUpdateSettings } from "../../hooks/useRQsettings";

// Configuration for settings fields - Add new fields here without backend changes
const SETTINGS_CONFIG = [
  {
    text_key: "stripe_admin_percentage",
    label: "Stripe Admin Percentage",
    placeholder: "Enter Stripe Admin Percentage",
    type: 1, // 1=Text, 2=Image
  },
  // Add more settings here in the future:
  //   {
  //     text_key: 'notification_email',
  //     label: 'Notification Email',
  //     placeholder: 'Enter value',
  //     type: 1,
  //   },
];

const General = () => {
  // Initialize form state dynamically from config
  const initialForm = useMemo(() => {
    return SETTINGS_CONFIG.reduce((acc, config) => {
      acc[config.text_key] = "";
      return acc;
    }, {});
  }, []);

  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();
  const [settingIds, setSettingIds] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  const { data: settingsData, isLoading } = useGetSettings();

  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings(
    (res) => {
      toast.success(res.message || "Settings updated successfully");
      // Update original values after successful save
      setOriginalValues({ ...form });
    }
  );

  useEffect(() => {
    if (settingsData?.data?.settings) {
      const newForm = {};
      const newSettingIds = {};
      const newOriginalValues = {};

      SETTINGS_CONFIG.forEach((config) => {
        const setting = settingsData.data.settings.find(
          (s) => s.text_key === config.text_key
        );
        if (setting) {
          const value = setting.text_value || "";
          newForm[config.text_key] = value;
          newOriginalValues[config.text_key] = value;
          newSettingIds[config.text_key] = setting.id;
        } else {
          newForm[config.text_key] = "";
          newOriginalValues[config.text_key] = "";
          newSettingIds[config.text_key] = null;
        }
      });

      setForm(newForm);
      setOriginalValues(newOriginalValues);
      setSettingIds(newSettingIds);
    }
  }, [settingsData]);

  // Check if any field has changed
  const hasChanges = SETTINGS_CONFIG.some(
    (config) => form[config.text_key] !== originalValues[config.text_key]
  );

  const handleCancel = () => {
    // Revert to original values
    setForm({ ...originalValues });
  };

  const handleFieldChange = (textKey, value) => {
    setForm((prev) => ({ ...prev, [textKey]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    // Find changed fields and update them
    const changedFields = SETTINGS_CONFIG.filter(
      (config) => form[config.text_key] !== originalValues[config.text_key]
    );

    // Update each changed field
    changedFields.forEach((config) => {
      const payload = {
        text_key: config.text_key,
        text_value: form[config.text_key],
        type: config.type,
      };

      if (settingIds[config.text_key]) {
        payload.id = settingIds[config.text_key];
      }

      updateSettings(payload);
    });
  };

  return (
    <div>
      <h2 className="page-title mb-3">General</h2>
      <Card className="settings-card shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {isLoading ? (
                <Col xs={12}>
                  <Spinner animation="border" size="sm" />
                </Col>
              ) : (
                SETTINGS_CONFIG.map((config) => (
                  <Col md={6} xs={12} key={config.text_key}>
                    <TNInput
                      label={config.label}
                      name={config.text_key}
                      value={form[config.text_key] || ""}
                      onChange={(e) =>
                        handleFieldChange(config.text_key, e.target.value)
                      }
                      placeholder={config.placeholder}
                    />
                  </Col>
                ))
              )}
            </Row>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCancel}
                disabled={!hasChanges || isSaving || isLoading}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!hasChanges || isSaving || isLoading}
              >
                {isSaving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default General;
