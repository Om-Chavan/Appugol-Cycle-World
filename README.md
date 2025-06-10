# Appugol Cycle World Website

A modern e-commerce website for a premium cycle shop, featuring a clean design with vibrant accents. The site includes functionality for shopping bikes and accessories, as well as scheduling repair and maintenance services.

## Features

- **E-commerce functionality** for selling cycles and accessories
- **Cycle repair and maintenance service** booking system
- **Modern and minimalist design** with colorful accents
- **Responsive layout** that works on desktop and mobile devices

## Pages

1. **Home** - Featuring hero section, product categories, featured products, services, and testimonials
2. **About** - Company story, mission, values, team members, and achievements
3. **Products** - Complete product catalog with filtering and sorting options
4. **Contact** - Contact information, form, map, service booking, and FAQs

## Technical Information

This website is built with:
- HTML5
- CSS3 (with custom variables and responsive design)
- Vanilla JavaScript (no frameworks)
- Font Awesome icons

## Setup Instructions

1. Ensure all files are in their correct directories:
   - HTML files in the root directory
   - CSS files in the `/css` directory
   - JavaScript files in the `/js` directory
   - Images in the `/images` directory

2. Add your actual product images to the `/images` directory (see the README in that folder for details)

3. The website can be viewed locally by opening any of the HTML files in a web browser

4. For production deployment, upload all files to your web hosting service

## Customization

### Colors

The color scheme can be easily modified by changing the CSS variables at the top of the `css/styles.css` file:

```css
:root {
    /* Primary Colors */
    --primary-color: #2e7df7; /* Vibrant blue */
    --secondary-color: #ff6b35; /* Bright orange for accents */
    /* ... other color variables ... */
}
```

### Content

All content can be edited directly in the HTML files:
- Product information in `products.html`
- Company information in `about.html`
- Service details in `index.html` and `contact.html`

### Adding Products

To add new products, copy an existing product card structure from the `products.html` file and update the details:

```html
<div class="product-card" data-category="category-name">
    <div class="product-image">
        <img src="images/product-image.jpg" alt="Product Name">
        <!-- Optional tags like "new" or "sale" -->
    </div>
    <div class="product-info">
        <h3>Product Name</h3>
        <!-- Product details -->
    </div>
</div>
```

## Browser Compatibility

This website is designed to work with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future development:
- User account system
- Shopping cart functionality
- Payment processing integration
- Product reviews and ratings
- Blog section with cycling tips and news
- Advanced search functionality