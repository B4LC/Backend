import {
  ApolloClient as Apollo,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { THEGRAPH_URI } from "../constants";
import {
  GET_DOC_UPLOADED_EVENT_DETAIL,
  GET_LC_APPROVED_EVENT_DETAIL,
  GET_LC_CREATED_EVENT_DETAIL,
  GET_LC_REJECTED_EVENT_DETAIL,
  GET_LC_STATUS_CHANGED_EVENT_DETAIL,
  GET_SALESCONTRACT_EVENT_DETAIL,
} from "../query";

export class FetchData {
  private httpLink = createHttpLink({
    uri: THEGRAPH_URI,
  });
  private ApolloClient = new Apollo({
    link: this.httpLink,
    cache: new InMemoryCache(),
  });

  async salesContractCreatedEvent(salesContractID: string) {
    try {
      const data = await this.ApolloClient.query({
        query: GET_SALESCONTRACT_EVENT_DETAIL,
        variables: {
          id: salesContractID,
        },
        fetchPolicy: "network-only",
      })
      return data.data.salesContractCreateds
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async LcCreatedEvent(LCID: string) {
    try {
      const data = await this.ApolloClient.query({
        query: GET_LC_CREATED_EVENT_DETAIL,
        variables: {
          lcid: LCID
        },
        fetchPolicy: "network-only",
      });
      return data.data.lcCreateds;
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async LcApprovedEvent(LCID: string) {
    try {
      const data = await this.ApolloClient.query({
        query: GET_LC_APPROVED_EVENT_DETAIL,
        variables: {
          where: {
            value: LCID,
          },
        },
        fetchPolicy: "network-only",
      });
      return data.data.lcApproveds
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async LcRejectedEvent(LCID: string) {
    try {
      const data = await this.ApolloClient.query({
        query: GET_LC_REJECTED_EVENT_DETAIL,
        variables: {
          where: {
            value: LCID,
          },
        },
        fetchPolicy: "network-only",
      })
      return data.data.lcRejecteds
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async LcStatusChangedEvent(LCID: string) {
    try {
      const data = await this.ApolloClient.query({
        query: GET_LC_STATUS_CHANGED_EVENT_DETAIL,
        variables: {
          where: {
            value: LCID,
          },
        },
        fetchPolicy: "network-only",
      })
      return data.data.lcStatusChangeds
    }
    catch(err) {
      console.log(err)
    }
  }

  async docUploadedEvent(LCID: string) {
    try {
      const data = await this.ApolloClient.query({
        query: GET_DOC_UPLOADED_EVENT_DETAIL,
        variables: {
          where: {
            value: LCID,
          },
        },
        fetchPolicy: "network-only",
      })
      return data.data.docUploadeds
    }
    catch(err) {
      console.log(err.message)
    }
  }
}
