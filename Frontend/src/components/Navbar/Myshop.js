// src/components/HomePage.jsx
import React from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    Carousel,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./myshop.css";
import CustomNavbar from "./Navbar";

const categories = [
    { name: "Parts & Accessories", img: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png" },
    { name: "Trading Cards", img: "https://cdn-icons-png.flaticon.com/512/2995/2995488.png" },
    { name: "Pre-Loved Luxury", img: "https://cdn-icons-png.flaticon.com/512/2331/2331966.png" },
    { name: "Sneakers", img: "https://cdn-icons-png.flaticon.com/512/859/859387.png" },
    { name: "Watches", img: "https://cdn-icons-png.flaticon.com/512/2983/2983426.png" },
    { name: "Handbags", img: "https://cdn-icons-png.flaticon.com/512/122/122220.png" },
    { name: "Start Selling", img: "https://cdn-icons-png.flaticon.com/512/3144/3144468.png" },
];

const trendingProducts = [
    {
        title: "Rolex Cellini Watch",
        price: "$9,599.00",
        img: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/1.webp",
    },
    {
        title: "Off-White Sneakers",
        price: "$199.00",
        img: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp",
    },
    {
        title: "Asus Zenbook Dual Screen",
        price: "$1,429.99",
        img: "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp",
    },
    {
        title: "Short Sleeve Shirt",
        price: "$129.50",
        img: "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp",
    },
];

const HomePage = () => {
    return (
        <>
            <CustomNavbar fixedTop={true} />

            {/* Hero Section */}
            <div className="main-banner text-dark d-flex align-items-center justify-content-center mt-3 pt-3" style={{ minHeight: "500px" }}>
                <Container fluid>
                    <Row className="align-items-center w-100 p-5">
                        <Col md={6}>
                            <Carousel fade indicators={false}>
                                <Carousel.Item>
                                    <div>
                                        <h2 className="fw-bold display-5 mb-3 text-shadow">Discover a Kaleidoscope of Cards</h2>
                                        <p className="lead">Build your collection of trading cards and CCGs.</p>
                                        <Button variant="dark" className="px-4 py-2">Find your favorites</Button>
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <div>
                                        <h2 className="fw-bold display-5 mb-3 text-shadow">Unleash Your Inner Collector</h2>
                                        <p className="lead">Explore rare and exclusive cards.</p>
                                        <Button variant="dark" className="px-4 py-2">Start exploring</Button>
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        </Col>

                        <Col md={6}>
                            <Carousel fade controls={false} indicators={false}>
                                <Carousel.Item>
                                    <img src="/banner1.png" alt="cards-banner" className="img-fluid rounded-4 shadow-lg" style={{ height: "350px", objectFit: "cover" }} />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src="/banner2.png" alt="cards-banner" className="img-fluid rounded-4 shadow-lg" style={{ height: "350px", objectFit: "cover" }} />
                                </Carousel.Item>
                            </Carousel>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Categories */}
            <Container className="py-5">
                <h4 className="mb-4 fw-semibold text-center">Explore Popular Categories</h4>
                <Row xs={2} md={4} lg={7} className="g-4 justify-content-center">
                    {categories.map((cat, idx) => (
                        <Col key={idx} className="text-center">
                            <Card className="border-0 glass-card p-3 hover-scale">
                                <Card.Img
                                    variant="top"
                                    src={cat.img}
                                    className="rounded-circle mx-auto category-img"
                                />
                                <Card.Body>
                                    <Card.Text className="fw-semibold small">{cat.name}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Trending Products */}
            <Container className="py-5">
                <h4 className="mb-4 fw-semibold text-center">Trending Products</h4>
                <Row xs={1} md={3} lg={4} className="g-4">
                    {trendingProducts.map((product, i) => (
                        <Col key={i}>
                            <Card className="product-card shadow-lg border-0 hover-glow">
                                <Card.Img
                                    variant="top"
                                    src={product.img}
                                    className="img-fluid rounded-top"
                                    alt={product.title}
                                />
                                <Card.Body>
                                    <Card.Title className="fw-semibold fs-6">{product.title}</Card.Title>
                                    <Card.Text className="text-muted">{product.price}</Card.Text>
                                    <Button variant="outline-dark" size="sm">
                                        Add to Cart
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default HomePage;
