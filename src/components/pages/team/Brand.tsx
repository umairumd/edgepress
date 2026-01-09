const brand_data: string[] = [
    "/assets/img/brand/logo-1.png",
    "/assets/img/brand/logo-2.png",
    "/assets/img/brand/logo-3.png",
    "/assets/img/brand/logo-4.png",
    "/assets/img/brand/logo-5.png",
    "/assets/img/brand/logo-3.png",
];

const Brand = () => {
    return (
        <div className="td-brand-area pt-90 pb-150">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="td-brand-wrap d-flex flex-wrap justify-content-center align-items-center" style={{ gap: '60px' }}>
                            {brand_data.map((brand, i) => (
                                <div key={i} className="td-brand-item">
                                    <img src={brand} alt="Partner brand logo" style={{ maxWidth: '100%', height: 'auto' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Brand;
