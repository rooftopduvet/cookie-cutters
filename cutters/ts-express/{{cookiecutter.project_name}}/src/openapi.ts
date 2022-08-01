/* eslint-disable no-use-before-define */

/** JSONAPILinks
 * @openapi
 * components:
 *  schemas:
 *    JSONAPILinks:
 *        type: object
 *        required:
 *          - self
 *        properties:
 *          self:
 *            type: string
 *            format: url
 *          prev:
 *            type: string
 *            format: url
 *          next:
 *            type: string
 *            format: url
 *          first:
 *            type: string
 *            format: url
 *          last:
 *            type: string
 *            format: url
 */
export interface JSONAPILinks {
  self: string,
  prev?: string,
  next?: string,
  first?: string,
  last?: string,
}

/** JSONAPIError
 * @openapi
 * components:
 *  schemas:
 *    JSONAPIError:
 *      type: object
 *      properties:
 *        status:
 *          type: integer
 *        title:
 *          type: string
 *        detail:
 *          type: string
 *        source:
 *          type: string
 *        required:
 *          - status
 *          - title
 *          - detail
 */
export interface JSONAPIError {
  status: number,
  title: string,
  detail: string,
  source?: string,
}

/** JSONAPIData
 * @openapi
 * components:
 *  schemas:
 *    JSONAPIData:
 *      type: object
 *      required:
 *        - id
 *        - type
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        type:
 *          type: string
 *        attributes:
 *          type: object
 *        relationships:
 *          type: object
 *          additionalProperties:
 *            oneOf:
 *              - $ref: '#/components/schemas/JSONAPIResponse'
 *              - type: array
 *                items:
 *                  $ref: '#/components/schemas/JSONAPIResponse'
 */
export interface JSONAPIData {
  id: string,
  type: string,
  attributes: { [name: string]: any },
  relationships?: { [name: string]: JSONAPIResponse },
}

/** JSONAPIResponse
 * @openapi
 * components:
 *  schemas:
 *    JSONAPIResponse:
 *      type: object
 *      properties:
 *        data:
 *          oneOf:
 *            - $ref: '#/components/schemas/JSONAPIData'
 *            - type: array
 *              items:
 *                - $ref: '#/components/schemas/JSONAPIResponse'
 *        links:
 *          $ref: '#/components/schemas/JSONAPILinks'
 */
export interface JSONAPIResponse {
  data: JSONAPIData | JSONAPIResponse[],
  links: JSONAPILinks,
}

/** JSONAPIErrorResponse
 * @openapi
 * components:
 *  schemas:
 *    JSONAPIErrorResponse:
 *      type: object
 *      properties:
 *        errors:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/JSONAPIError'
 */
export interface JSONAPIErrorResponse {
  errors: JSONAPIError[],
}

/** BaseAttributes
 * @openapi
 * components:
 *  schemas:
 *    BaseAttributes:
 *      type: object
 *      properties:
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
export interface BaseAttributes {
  createdAt: Date,
  updatedAt: Date,
}
