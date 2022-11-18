pragma solidity ^0.8.17;

contract ticketsale {

    address public manager;
    address payable[] public attendee;
    uint public ticketCount;
    uint public ticketCost;
    uint public ticketsSold;
    uint public lastId;
    mapping(uint => bool) public sold;
    mapping(address => uint) public ticketOwner;
    mapping(address => address) public offer;

    constructor (uint numTickets, uint price) public {
        manager = msg.sender;
        ticketCount = numTickets;
        ticketCost= price;

    }

    function buyTicket (uint ticketId) public payable {
        bytes memory data;
        bool success;

        //VALIDATE THAT THE PARAMETER tickedId IS WITHIN THE TICKET ID ARRAY
        require(ticketId<ticketCount, "Not a valid ticket.");

        //VALIDATE THAT THE TICKET OF ticketId HAS NOT ALREADY BEEN SOLD
        require(!sold[ticketId], "Ticket is already sold.");
        
        //VALIDATE THAT THE USER PROVIDES THE AMOUNT OF ETHER EQUAL TO price
        require(msg.value >= ticketCost, "Incorrect amount of Ether supplied.");
        
        //VALIDATE THAT THE USER DOES NOT ALREADY HAVE A TICKET
        require(ticketOwner[msg.sender] == 0, "User already has a ticket");
        
        //SEND price OF ETHER FROM BUYER TO MANAGER
        (success, data)= manager.call{value: ticketCost}("");

        //ASSIGN TICKET OF ticketId TO BUYER
        ticketOwner[msg.sender] = ticketId;
        
        //MARK THE TICKET WITH ticketId AS SOLD
        sold[ticketId] = true;

        //add one to ticket_sold
        ticketsSold = ticketsSold + 1;
    }
    
    //PART OF THE NEXT FUNCTION 
    //THIS PART IS TAKEN FROM https://ethereum.stackexchange.com/questions/7139/whats-the-solidity-statement-to-print-data-to-the-console
    event printId(uint ticketId);

    function getTicketOf (address person) public view returns (uint) {
        return ticketOwner[person];
    }

    function offerSwap (address partner) public {
        require(ticketOwner[msg.sender] != 0, "Offerer does not have a ticket");
        require(ticketOwner[partner] != 0, "Partner does not have a ticket");
        offer[msg.sender] = partner;
    }

    function acceptSwap (address partner) public {
        //VALIDATE THAT BOTH THE SENDING USER AND partner HAVE A TICKET
        require(offer[partner] == msg.sender);

        //REASSIGN TICKETS TO OPPOSITE ACCOUNTS
        uint placeHolder = ticketOwner[msg.sender];
        ticketOwner[msg.sender] = ticketOwner[partner];
        ticketOwner[partner] = placeHolder;

        //DESTROY THE OFFER
        offer[partner] = address(0);
    }

}
