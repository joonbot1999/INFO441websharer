1. Edits
    1.1 used a different font for user input information
    1.2 prevents users from submitting empty form
    1.3 more vibrant color
    1.4 shadow for card elements
2. Heroku link: https://hidden-dawn-62502.herokuapp.com/
3. Additional information
    1.1 added radio buttons for user submitted content type for content accuracy
    1.2 made content_type for mongodb
    1.3 the client side reads this as 'type'
4. Additional help: none
5. A5 Azure link: https://www.nooneknowswhattheyredoing.me/
6. A6 Azure link: https://www.nooneknowswhattheyredoing.me/
7. A7 Azure link: https://www.nooneknowswhattheyredoing.me/
8. A7 implementation details:
    - Made it so that a user can enter in their favorite YouTuber's name for the query
    - Once the name is uploaded to the database, it will use YouTube API to generate 5 random videos among the most recent 50
    - If the name doesn't exist, it'll return 500 error
    - If the creator has less than 50 videos or the user hasn't set up their favotire YouTuber, it will not display anything
    - The user can update their favorite YouTuber by querying a different name
    - People can click on 'Get different videos by this creator' to get different videos uploaded by the creator
    - WARNING: API quota may exceed if refreshed in quick succession multiple times. If so, it'll return [Object object]
