import React, { FormEvent, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import onError from '../lib/errorLib';
import config from '../config';
import "./NewNote.css";
import { API } from 'aws-amplify';
import s3upload from '../lib/awsLib';

export interface INote {
    noteId?: string;
    note: string;
    attachment: string;
    createdAt?: string;
    attachmentUrl?: string;
}

const NewNote = () => {
    const file = useRef<File>()
    const history = useHistory();
    const [note, setNote] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = () => {
        return note.length > 0
    }

    const handleFileChange = (event: any) => {
        file.current = event?.target?.files[0];
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert('Please pickup smaller file');
            return;
        }
        setIsLoading(true);
        try {
            const attachment = file.current ? await s3upload(file.current) : ""
            const payload: INote = { note, attachment }
            await createNote(payload);
            history.push("/");
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }
    }

    const createNote = (body: INote) => {
        return API.post("notes", "/notes", {
            body
        })
    }

    return (
        <div className="NewNote">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="note">
                    <Form.Control
                        value={note!}
                        as="textarea"
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
};

export default NewNote;
