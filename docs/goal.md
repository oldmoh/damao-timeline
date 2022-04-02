# Goal of timeline

## First Stage

- ~~LocalStorage~~[^1]
- IndexedDB
- Tags
- Searching
- Single Page Application
- Synchronizing data with Google Drive by Oath
- Displaying by different time scales
- Batch updating and deletion

[^1]: LocalStorage is not considered due to limit of storage capacity according to different browsers.

## Second Stage

- Sharable
- Sharing leve: public, restricted, private
- Tags may not have to be sharable

## Data Structure

### Event

| Attribute       | Type     | Descriptions   |
| --------------- | -------- | -------------- |
| Event Id        | Integer  |                |
| Event datetime  | Datetime |                |
| Event title     | String   |                |
| Event detail    | String   |                |
| Tags            | List     | list of tag id |
| Involved people | List     |                |
| Color           | String   | RGB            |
| Is archived     | Bool     |                |
| Created by      |          |                |

### Tag

| Attribute | Type    | Descriptions |
| --------- | ------- | ------------ |
| Tag ID    | Integer |              |
| Tag name  | String  |              |
| Color     | String  | RGB          |
