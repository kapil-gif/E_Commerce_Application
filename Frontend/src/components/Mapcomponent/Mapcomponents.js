import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./map.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Location Picker Component
function LocationPicker({ setSelectedLocation, setFormData }) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                );
                const data = await res.json();
                const address = data.address;

                setSelectedLocation({ lat, lng });

                setFormData((prev) => ({
                    ...prev,
                    label: data.display_name || "",
                    city: address.city || address.town || address.village || "",
                    tehsil: address.county || address.state_district || "",
                    pincode: address.postcode || "",
                }));
            } catch (error) {
                console.error("Reverse geocoding failed", error);
                setSelectedLocation({ lat, lng });
                setFormData((prev) => ({
                    ...prev,
                    label: `Lat: ${lat}, Lng: ${lng}`,
                }));
            }
        },
    });
    return null;
}

const MapComponent = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        label: "",
        city: "",
        tehsil: "",
        pincode: "",
    });

    const fetchLocations = async () => {
        try {
            const res = await axios.get("http://localhost:8080/location/get_locations");
            setLocations(res.data.responce || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedLocation || !formData.label) {
            alert("📍 Please select a location and wait for autofill.");
            return;
        }

        const payload = {
            name: formData.label,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            city: formData.city,
            tehsil: formData.tehsil,
            pincode: formData.pincode,
        };

        try {
            await axios.post("http://localhost:8080/location/save_location", payload);
            //localStorage.setItem("payload", JSON.stringify(payload)); //  Save to localStorage
            setFormData({ label: "", city: "", tehsil: "", pincode: "" });
            setSelectedLocation(null);
            fetchLocations();


            //console.log("address set in map  :", Address);
            navigate("/ordercomformation");
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <Container className="mt-4">
            <Row>
                <Col md={8} className="map-container">
                    <h4 className="mb-3 text-primary fw-bold">🌍 Pick a Location</h4>
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        scrollWheelZoom
                        style={{
                            height: "500px",
                            width: "100%",
                            borderRadius: "12px",
                            border: "2px solid #dee2e6",
                        }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker setSelectedLocation={setSelectedLocation} setFormData={setFormData} />

                        {selectedLocation && (
                            <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                                <Popup>{formData.label}</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </Col>

                <Col md={4}>
                    <Card className="shadow location-form-card mt-4 mt-md-0">
                        <Card.Body>
                            <h5 className="mb-3 text-success fw-semibold">📌 Location Details</h5>

                            {selectedLocation && (
                                <div className="mb-2 text-muted small">
                                    Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
                                </div>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Label</Form.Label>
                                    <Form.Control
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        placeholder="Auto-filled location name"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>City / Village</Form.Label>
                                    <Form.Control
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="e.g., Jaipur"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tehsil / District</Form.Label>
                                    <Form.Control
                                        value={formData.tehsil}
                                        onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                                        placeholder="e.g., Sanganer"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pincode</Form.Label>
                                    <Form.Control
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        placeholder="e.g., 302029"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Save & Continue
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MapComponent;
