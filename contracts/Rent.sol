// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Rent {
    struct RentDetail {
        uint256 rentId; // id of Vehicle
        string name; // short name of Vehicle
        uint256 security; // security money
        string description; // full description about vehicle
        int256 availability; //-1:maintenance 0:rented 1:available
        uint256 popularity; // how many times vehicle rented
        uint256 rentPerDay;
        address payable person;
        address payable owner;
        bool exists;
    }

    event RentCreated(
        uint256 rentId,
        string name,
        uint256 security,
        string description,
        uint256 rentPerDay,
        address payable person
    );

    event RentTaken(
        uint256 rentId,
        string name,
        uint256 security,
        string description,
        uint256 rentPerDay,
        address payable person
    );

    event RentDeleted();

    address payable manager;
    uint256 public rentCount;

    mapping(uint256 => address[]) public pastRents; // list of people who rented this vehicle
    mapping(uint256 => uint256) public rentingTime; //time at which he take vehicle at rent
    mapping(uint256 => uint256) public timeOfRent; // amount of time for rent
    mapping(address => bool) public isRenting;
    mapping(address => uint256) public rented;
    mapping(uint256 => address) rentedBy;
    RentDetail[] allRents;
    mapping(uint256 => RentDetail) public rentDetails;

    modifier permission() {
        require(msg.sender == manager);
        _;
    }

    constructor() public {
        manager = msg.sender;
        rentCount = 0;
    }

    function createRent(
        string memory _name,
        string memory _description,
        uint256 _security,
        uint256 _rentPerDay
    ) public {
        require(bytes(_name).length > 0, "Please input Name");
        require(_security > 0, "Please input a security value");
        require(bytes(_description).length > 0, "Please input a description");
        // require(_security + _rentPerDay > 0);
        // require(msg.sender == manager);
        int256 availability = 1;
        uint256 popularity = 0;

        rentCount = rentCount + 1;

        rentDetails[rentCount] = RentDetail(
            rentCount,
            _name,
            _security,
            _description,
            availability,
            popularity,
            _rentPerDay,
            address(0),
            msg.sender,
            true
        );
        allRents.push(rentDetails[rentCount]);
        emit RentCreated(
            rentCount,
            _name,
            _security,
            _description,
            _rentPerDay,
            msg.sender
        );
    }

    function editDetails(
        uint256 _id,
        string memory newname,
        uint256 newsecurity,
        string memory newDescription,
        uint256 newrentPerDay
    ) public {
        RentDetail storage _rentDetail = rentDetails[_id];
        require(
            _rentDetail.owner == msg.sender,
            "You are not the owner of this car"
        );
        _rentDetail.name = newname;
        _rentDetail.security = newsecurity;
        _rentDetail.description = newDescription;
        _rentDetail.rentPerDay = newrentPerDay;

        /// update mapping
        rentDetails[_id] = _rentDetail;

        // update array
        for (uint256 i; i < allRents.length; i++) {
            if (allRents[i].rentId == _id) {
                allRents[i].name = newname;
                allRents[i].security = newsecurity;
                allRents[i].description = newDescription;
                allRents[i].rentPerDay = newrentPerDay;
            }
        }
    }

    function takeOnMaintenance(uint256 _id) public permission {
        RentDetail storage _rentDetail = rentDetails[_id];
        _rentDetail.availability = -1;
        rentDetails[_id] = _rentDetail;
    }

    function returnFromMaintenance(uint256 _id) public permission {
        RentDetail storage _rentDetail = rentDetails[_id];
        _rentDetail.availability = 1;
        rentDetails[_id] = _rentDetail;
    }

    function takeRent(
        uint256 _id,
        // uint256 _rentingTime,
        uint256 _timeOfRent
    ) public payable {
        RentDetail storage _rentDetail = rentDetails[_id];
        address payable _owner = _rentDetail.owner;
        require(
            isRenting[msg.sender] == false,
            "You are already renting a car"
        );
        require(_rentDetail.exists == true, "This Car does not exist");

        require(_rentDetail.availability == 1, "The vehicle is not available");
        require(
            _rentDetail.owner != msg.sender,
            "You are the owner of this car, Use another account to rent"
        );
        // rentingTime[_rentDetail.rentId] = _rentingTime;
        uint256 total = _timeOfRent *
            _rentDetail.rentPerDay +
            _rentDetail.security;
        require(msg.value >= total, "The amount does not cover fees");
        _rentDetail.person = msg.sender;
        _rentDetail.popularity++;
        _rentDetail.availability = 0;
        pastRents[_rentDetail.rentId].push(msg.sender);
        rentDetails[_id] = _rentDetail;

        rented[msg.sender] = _id;
        isRenting[msg.sender] = true;
        rentedBy[_id] = msg.sender;

        // transfer funds
        uint256 toTransfer = (msg.value - _rentDetail.security);
        address(_owner).transfer(toTransfer);

        // update mapping
        rentDetails[_id] = _rentDetail;

        // Update array
        for (uint256 i; i < allRents.length; i++) {
            if (allRents[i].rentId == _id) {
                allRents[i].availability = 0;
                allRents[i].person = msg.sender;
                allRents[i].popularity = allRents[i].popularity + 1;
            }
        }
        emit RentTaken(
            rentCount,
            _rentDetail.name,
            _rentDetail.security,
            _rentDetail.description,
            _rentDetail.rentPerDay,
            msg.sender
        );
    }

    function returnRent(uint256 _id) public payable {
        RentDetail storage _rentDetail = rentDetails[_id];
        require(_rentDetail.exists == true, "This does not exist");
        address payable _owner = _rentDetail.owner;
        address payable _person = _rentDetail.person;

        // transfer security back to leaser
        _person.transfer(_rentDetail.security);

        _rentDetail.availability = 1;
        _rentDetail.person = address(0);

        // update
        timeOfRent[_id] = 0;
        isRenting[rentedBy[_id]] = false;
        rented[rentedBy[_id]] = 0;

        // update mapping
        rentDetails[_id] = _rentDetail;

        // Update array
        for (uint256 i; i < allRents.length; i++) {
            if (allRents[i].rentId == _id) {
                allRents[i].availability = 1;
                allRents[i].person = address(0);
            }
        }
    }

    function getCurrentLessor(uint256 _id) public view returns (address) {
        require(pastRents[_id].length > 0);
        return pastRents[_id][pastRents[_id].length - 1];
    }

    function deleteRent(uint256 _id) public {
        RentDetail storage _rentDetail = rentDetails[_id];
        require(_rentDetail.exists == true, "This does not exist");
        require(
            _rentDetail.owner == msg.sender,
            "You are not the creator of this Rent"
        );
        delete rentDetails[_id];
        _rentDetail.exists = false;
        rentCount--;
        isRenting[rentedBy[_id]] = false;
        rented[rentedBy[_id]] = 0;
        rentDetails[_id] = _rentDetail;
        for (uint256 i; i < allRents.length; i++) {
            if (allRents[i].rentId == _id) {
                allRents[i].exists = false;
            }
        }
        emit RentDeleted();
    }

    function getAllRent() public view returns (RentDetail[] memory) {
        return allRents;
    }

    function getRent(uint256 _id) public view returns (RentDetail memory) {
        return rentDetails[_id];
    }

    function takeToMaintenance(uint256 _id) public {
        RentDetail storage _rentDetail = rentDetails[_id];
        require(_rentDetail.exists == true, "This does not exist");
        require(
            _rentDetail.owner == msg.sender,
            "You are not the creator of this Rent"
        );

        _rentDetail.availability = -1;
        // update mapping
        rentDetails[_id] = _rentDetail;

        // Update array
        for (uint256 i; i < allRents.length; i++) {
            if (allRents[i].rentId == _id) {
                allRents[i].availability = -1;
            }
        }
    }

    function removeFromMaintenance(uint256 _id) public {
        RentDetail storage _rentDetail = rentDetails[_id];
        require(_rentDetail.exists == true, "This does not exist");
        require(
            _rentDetail.owner == msg.sender,
            "You are not the creator of this Rent"
        );

        _rentDetail.availability = -1;
        // update mapping
        rentDetails[_id] = _rentDetail;

        // Update array
        for (uint256 i; i < allRents.length; i++) {
            if (allRents[i].rentId == _id) {
                allRents[i].availability = 1;
            }
        }
    }
}
