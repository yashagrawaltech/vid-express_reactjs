## API'S

    - health-check
        1. GET - /api/health-check

    - user
        1. POST - /api/user/signup
        2. POST - /api/user/signin
        3. POST - /api/user/signout
        4. GET - /api/user/
        5. PATCH - /api/user
        6. DELETE - /api/user
        7. GET - /api/user/:id
        8. PATCH (admin only) - /api/user/:id
        9. DELETE (admin only) - /api/user/:id
        10. POST - /api/user/forget-password
        11. POST - /api/user/update-password
        12. POST - /api/user/clear-watch-history

    - video
        1. POST - /api/video/post
        2. GET - /api/video/
        3. GET - /api/video/:id
        4. PATCH - /api/video/:id
        5. DELETE - /api/video/:id

    - subscription
        1. DELETE - /api/user/subscriber/:id
        2. POST - /api/user/subcription/:id
        3. DELETE - /api/user/subcription/:id
